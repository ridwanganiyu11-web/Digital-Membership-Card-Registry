// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MembershipCardRegistry
 * @dev Multi-organization digital membership card registry for Botchain (Chain ID: 968).
 * Organizations issue, renew, and revoke digital membership cards to member wallets.
 * Anyone can verify cards on-chain without gas or a wallet.
 */
contract MembershipCardRegistry {

    enum MembershipStatus {
        Active,     // 0
        Suspended,  // 1
        Revoked,    // 2
        Expired     // 3 (computed or explicitly set)
    }

    struct Organization {
        address wallet;
        string name;
        string description;
        string logoUrl;
        uint256 registeredAt;
        bool isRegistered;
    }

    struct MembershipCard {
        uint256 id;
        address orgWallet;
        address memberWallet;
        string memberName;
        string membershipNumber; // e.g. "MBR-000125"
        uint256 issuedAt;
        uint256 expiresAt;
        MembershipStatus status;
        string metadataUri;      // Optional IPFS/URL or role metadata
    }

    // State Variables
    uint256 private _nextCardId = 1;
    address[] public registeredOrgAddresses;

    // Mappings
    mapping(address => Organization) public organizations;
    mapping(uint256 => MembershipCard) public cards;
    
    // Org to card IDs
    mapping(address => uint256[]) private _orgCards;
    // Member wallet to card IDs
    mapping(address => uint256[]) private _memberCards;

    // Events
    event OrganizationRegistered(
        address indexed orgWallet,
        string name,
        string logoUrl,
        uint256 timestamp
    );
    event OrganizationUpdated(
        address indexed orgWallet,
        string name,
        string description,
        string logoUrl
    );
    event MembershipIssued(
        uint256 indexed cardId,
        address indexed orgWallet,
        address indexed memberWallet,
        string memberName,
        string membershipNumber,
        uint256 expiresAt
    );
    event MembershipRenewed(
        uint256 indexed cardId,
        uint256 oldExpiresAt,
        uint256 newExpiresAt
    );
    event MembershipRevoked(
        uint256 indexed cardId,
        address indexed orgWallet
    );
    event MembershipStatusChanged(
        uint256 indexed cardId,
        MembershipStatus newStatus
    );

    // Modifiers
    modifier onlyRegisteredOrg() {
        require(organizations[msg.sender].isRegistered, "Caller is not a registered organization");
        _;
    }

    modifier onlyCardIssuer(uint256 cardId) {
        require(cards[cardId].id != 0, "Card does not exist");
        require(cards[cardId].orgWallet == msg.sender, "Caller is not the issuing organization");
        _;
    }

    /**
     * @notice Register a new organization
     */
    function registerOrganization(
        string calldata name,
        string calldata description,
        string calldata logoUrl
    ) external {
        require(bytes(name).length > 0, "Organization name cannot be empty");
        require(!organizations[msg.sender].isRegistered, "Organization already registered");

        organizations[msg.sender] = Organization({
            wallet: msg.sender,
            name: name,
            description: description,
            logoUrl: logoUrl,
            registeredAt: block.timestamp,
            isRegistered: true
        });

        registeredOrgAddresses.push(msg.sender);

        emit OrganizationRegistered(msg.sender, name, logoUrl, block.timestamp);
    }

    /**
     * @notice Update organization profile details
     */
    function updateOrganization(
        string calldata name,
        string calldata description,
        string calldata logoUrl
    ) external onlyRegisteredOrg {
        require(bytes(name).length > 0, "Organization name cannot be empty");

        Organization storage org = organizations[msg.sender];
        org.name = name;
        org.description = description;
        org.logoUrl = logoUrl;

        emit OrganizationUpdated(msg.sender, name, description, logoUrl);
    }

    /**
     * @notice Issue a membership card to a member wallet
     * @param memberWallet Member's wallet address
     * @param memberName Member's full name or handle
     * @param membershipNumber Unique code (e.g., MBR-000125)
     * @param validityDays Number of days the card is valid
     * @param metadataUri Optional additional metadata / avatar URI
     */
    function issueMembership(
        address memberWallet,
        string calldata memberName,
        string calldata membershipNumber,
        uint256 validityDays,
        string calldata metadataUri
    ) external onlyRegisteredOrg returns (uint256) {
        require(memberWallet != address(0), "Invalid member wallet address");
        require(bytes(memberName).length > 0, "Member name cannot be empty");
        require(validityDays > 0, "Validity days must be greater than 0");

        uint256 cardId = _nextCardId++;
        uint256 expiresAt = block.timestamp + (validityDays * 1 days);

        cards[cardId] = MembershipCard({
            id: cardId,
            orgWallet: msg.sender,
            memberWallet: memberWallet,
            memberName: memberName,
            membershipNumber: membershipNumber,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            status: MembershipStatus.Active,
            metadataUri: metadataUri
        });

        _orgCards[msg.sender].push(cardId);
        _memberCards[memberWallet].push(cardId);

        emit MembershipIssued(cardId, msg.sender, memberWallet, memberName, membershipNumber, expiresAt);

        return cardId;
    }

    /**
     * @notice Renew an existing membership by adding validity days
     * @param cardId ID of the card
     * @param additionalDays Days to extend validity
     */
    function renewMembership(uint256 cardId, uint256 additionalDays) external onlyCardIssuer(cardId) {
        require(additionalDays > 0, "Additional days must be greater than 0");
        MembershipCard storage card = cards[cardId];
        require(card.status != MembershipStatus.Revoked, "Cannot renew revoked membership");

        uint256 oldExpiresAt = card.expiresAt;
        // If already expired, extend from now; otherwise extend from existing expiry
        if (block.timestamp > card.expiresAt) {
            card.expiresAt = block.timestamp + (additionalDays * 1 days);
        } else {
            card.expiresAt += (additionalDays * 1 days);
        }

        // Re-activate if was suspended or expired
        card.status = MembershipStatus.Active;

        emit MembershipRenewed(cardId, oldExpiresAt, card.expiresAt);
    }

    /**
     * @notice Revoke a membership card permanently
     * @param cardId ID of the card
     */
    function revokeMembership(uint256 cardId) external onlyCardIssuer(cardId) {
        MembershipCard storage card = cards[cardId];
        require(card.status != MembershipStatus.Revoked, "Card is already revoked");

        card.status = MembershipStatus.Revoked;

        emit MembershipRevoked(cardId, msg.sender);
    }

    /**
     * @notice Suspend or unsuspend a membership card
     * @param cardId ID of the card
     * @param suspend True to suspend, false to activate
     */
    function setSuspended(uint256 cardId, bool suspend) external onlyCardIssuer(cardId) {
        MembershipCard storage card = cards[cardId];
        require(card.status != MembershipStatus.Revoked, "Cannot change status of revoked card");

        if (suspend) {
            card.status = MembershipStatus.Suspended;
        } else {
            card.status = MembershipStatus.Active;
        }

        emit MembershipStatusChanged(cardId, card.status);
    }

    // ==========================================
    // READ-ONLY / VERIFICATION FUNCTIONS (FREE)
    // ==========================================

    /**
     * @notice Computes effective status considering expiry timestamp
     */
    function getEffectiveStatus(uint256 cardId) public view returns (MembershipStatus) {
        MembershipCard storage card = cards[cardId];
        require(card.id != 0, "Card does not exist");

        if (card.status == MembershipStatus.Revoked) {
            return MembershipStatus.Revoked;
        }
        if (card.status == MembershipStatus.Suspended) {
            return MembershipStatus.Suspended;
        }
        if (block.timestamp > card.expiresAt) {
            return MembershipStatus.Expired;
        }
        return MembershipStatus.Active;
    }

    /**
     * @notice Full public verification of a membership card
     * @return isValid True if active and unexpired
     * @return effectiveStatus Status string (Active, Expired, Revoked, Suspended)
     * @return card Card data
     * @return org Organization details
     */
    function verifyMembership(uint256 cardId) external view returns (
        bool isValid,
        string memory effectiveStatus,
        MembershipCard memory card,
        Organization memory org
    ) {
        require(cards[cardId].id != 0, "Card does not exist");

        card = cards[cardId];
        org = organizations[card.orgWallet];

        MembershipStatus status = getEffectiveStatus(cardId);

        if (status == MembershipStatus.Active) {
            return (true, "Active", card, org);
        } else if (status == MembershipStatus.Expired) {
            return (false, "Expired", card, org);
        } else if (status == MembershipStatus.Revoked) {
            return (false, "Revoked", card, org);
        } else {
            return (false, "Suspended", card, org);
        }
    }

    /**
     * @notice Retrieve card by ID
     */
    function getMembership(uint256 cardId) external view returns (MembershipCard memory) {
        require(cards[cardId].id != 0, "Card does not exist");
        return cards[cardId];
    }

    /**
     * @notice Get all card IDs belonging to a member wallet
     */
    function getMemberCards(address memberWallet) external view returns (uint256[] memory) {
        return _memberCards[memberWallet];
    }

    /**
     * @notice Get all card IDs issued by an organization
     */
    function getOrgCards(address orgWallet) external view returns (uint256[] memory) {
        return _orgCards[orgWallet];
    }

    /**
     * @notice Count total registered organizations
     */
    function getOrganizationCount() external view returns (uint256) {
        return registeredOrgAddresses.length;
    }

    /**
     * @notice Get all registered organizations
     */
    function getAllOrganizations() external view returns (Organization[] memory) {
        uint256 total = registeredOrgAddresses.length;
        Organization[] memory list = new Organization[](total);
        for (uint256 i = 0; i < total; i++) {
            list[i] = organizations[registeredOrgAddresses[i]];
        }
        return list;
    }

    /**
     * @notice Get total cards ever issued
     */
    function getTotalCardsIssued() external view returns (uint256) {
        return _nextCardId - 1;
    }
}

