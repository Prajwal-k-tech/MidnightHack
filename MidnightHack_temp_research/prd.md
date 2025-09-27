# PRD: dApp - Privacy-First Dating Platform

## 1. Product overview

### 1.1 Document title and version

* PRD: dApp - Privacy-First Dating Platform
* Version: 1.0

### 1.2 Product summary

dApp is a revolutionary dating platform that solves the "catfish problem" through zero-knowledge proofs and verified compatibility matching. Unlike traditional dating apps where users can lie about age, location, income, or identity, dApp uses Midnight blockchain technology to enable users to prove their attributes without revealing sensitive data.

The platform targets privacy-conscious professionals tired of wasting time on incompatible matches and fake profiles. Users maintain complete control over their personal information while proving key compatibility factors like age range, location proximity, education level, and income brackets through cryptographic proofs rather than blind trust.

## 2. Goals

### 2.1 Business goals

* Create the first truly privacy-preserving dating platform with verifiable user attributes
* Capture market share among privacy-conscious professionals aged 25-40
* Demonstrate practical zero-knowledge proof applications in consumer products
* Build a sustainable revenue model based on quality matches rather than engagement addiction
* Establish dApp as the go-to platform for serious relationship seekers

### 2.2 User goals

* Find compatible partners without revealing sensitive personal information
* Avoid catfishing and fake profiles through cryptographic verification
* Maintain privacy while proving key compatibility factors
* Reduce time wasted on incompatible matches
* Feel secure that their data isn't being sold or misused
* Connect with equally serious and verified individuals

### 2.3 Non-goals

* Competing with hookup-focused platforms
* Supporting casual dating or social networking features
* Implementing gamification or addictive engagement patterns
* Building mobile apps in the initial version
* Integrating with existing social media platforms (initially)

## 3. User personas

### 3.1 Key user types

* Privacy-conscious professionals seeking serious relationships
* Tech-savvy individuals who understand data protection value
* People who have been catfished or encountered fake profiles
* High-earning professionals who want income-verified matches
* Location-specific daters (remote workers, frequent travelers)

### 3.2 Basic persona details

* **Sarah, 28, Software Engineer**: Values privacy, seeks verified compatibility, tired of fake profiles on traditional apps
* **Mike, 32, Financial Analyst**: Wants income-verified matches, prioritizes authenticity, concerned about data mining
* **Lisa, 35, Marketing Director**: Frequent traveler, needs location flexibility, wants education-verified partners

### 3.3 Role-based access

* **Verified User**: Full platform access with completed identity verification
* **Pending User**: Limited access until identity verification is complete
* **Admin**: Platform moderation and verification oversight capabilities

## 4. Functional requirements

* **Identity Verification System** (Priority: Critical)
  * Government ID verification with zero-knowledge proofs
  * Sybil resistance through salted ID storage
  * One-person-one-account enforcement

* **Privacy-Preserving Preference Matching** (Priority: Critical)
  * Age range preferences with ZK proofs
  * Location proximity without revealing exact addresses
  * Income bracket verification without exposing specific amounts
  * Education level verification without revealing institutions

* **Compatibility Scoring Engine** (Priority: High)
  * Private preference matching algorithms
  * Mutual compatibility verification
  * Match quality indicators based on verified attributes

* **Secure Communication System** (Priority: High)
  * End-to-end encrypted messaging
  * Selective disclosure of contact information
  * Privacy-preserving video call verification

## 5. User experience

### 5.1 Entry points & first-time user flow

* Landing page emphasizing privacy and verification benefits
* Account creation with government ID upload
* Identity verification process with clear privacy explanations
* Preference setting with privacy controls
* Tutorial on how ZK proofs protect their data

### 5.2 Core experience

* **Profile Creation**: Users create profiles with verifiable attributes while keeping sensitive data private
  * This ensures authentic connections based on real compatibility factors

* **Smart Matching**: Algorithm matches users based on verified preferences and compatibility scores
  * This reduces time wasted on incompatible or fake profiles

* **Proof-Based Verification**: Users can request proofs of specific attributes from potential matches
  * This builds trust without compromising privacy

* **Secure Communication**: Matched users communicate through encrypted channels with selective disclosure
  * This maintains privacy until both parties choose to reveal more information

### 5.3 Advanced features & edge cases

* LinkedIn integration for professional verification (optional)
* Location spoofing detection and prevention
* Handling of incomplete or failed identity verification
* Privacy settings granularity for different types of proofs
* Appeal process for verification failures

### 5.4 UI/UX highlights

* Clear privacy indicators showing what information is proven vs. revealed
* Intuitive proof request and verification flow
* Visual representation of compatibility scores
* Transparent explanation of how user data is protected
* Streamlined verification process with progress indicators

## 6. Narrative

Sarah opens dApp after another disappointing experience on traditional dating apps. She uploads her government ID, which is cryptographically verified without storing her personal details. She sets her preferences - looking for someone 25-35, within 20 miles, with a college degree and stable income. The platform matches her with Mike, who has proven all these attributes without revealing his exact age, address, or salary. They connect knowing their fundamental compatibility is verified, not just claimed. Their first conversation focuses on shared interests rather than validating basic facts, leading to a genuine connection built on trust and verified compatibility.

## 7. Success metrics

### 7.1 User-centric metrics

* Identity verification completion rate (target: >85%)
* User satisfaction with match quality (target: >80% rating matches as "compatible")
* Time to first meaningful conversation (target: <24 hours after matching)
* Reduction in reported fake profiles (target: <1% of user reports)
* User retention rate for verified users (target: >60% monthly retention)

### 7.2 Business metrics

* Monthly active verified users (target: 10,000 in first 6 months)
* Conversion rate from visitor to verified user (target: >15%)
* Revenue per verified user (target: $20/month average)
* Platform trust score based on user surveys (target: >4.5/5)

### 7.3 Technical metrics

* ZK proof generation success rate (target: >99%)
* Average proof verification time (target: <2 seconds)
* Platform uptime and availability (target: >99.9%)
* Data breach incidents (target: 0)

## 8. Technical considerations

### 8.1 Integration points

* Midnight blockchain for ZK proof generation and verification
* Government ID verification APIs for initial identity validation
* Encrypted messaging infrastructure for secure communication
* Geolocation services for proximity verification
* Optional LinkedIn API for professional verification

### 8.2 Data storage & privacy

* Zero personal data stored on-chain
* Encrypted local storage for user preferences
* Salted hashes for government ID sybil resistance
* End-to-end encryption for all communications
* GDPR and CCPA compliance by design

### 8.3 Scalability & performance

* Proof generation optimization for mobile browser compatibility
* CDN integration for global performance
* Database sharding for user growth
* Caching strategies for frequently accessed compatibility scores

### 8.4 Potential challenges

* User education on zero-knowledge proofs and privacy benefits
* Government ID verification API limitations and accuracy
* Proof generation time optimization for smooth UX
* Regulatory compliance across different jurisdictions
* Preventing sophisticated spoofing attempts

## 9. Milestones & sequencing

### 9.1 Project estimate

* Medium: 12-16 weeks for MVP with core features

### 9.2 Team size & composition

* 4 people: 1 Midnight/ZK developer, 2 full-stack developers, 1 UI/UX designer

### 9.3 Suggested phases

* **Phase 1**: Identity verification and basic matching (4 weeks)
  * Government ID verification system
  * Basic ZK proof generation for age and location
  * Simple matching algorithm
  * Core user registration and profile creation

* **Phase 2**: Advanced privacy features and communication (6 weeks)
  * Income and education verification
  * Encrypted messaging system
  * Preference-based matching with compatibility scores
  * Advanced privacy controls

* **Phase 3**: Platform optimization and scaling (6 weeks)
  * Performance optimization
  * Advanced matching algorithms
  * LinkedIn integration
  * Mobile-responsive design improvements

## 10. User stories

### 10.1. Account creation and identity verification

* **ID**: GH-001
* **Description**: As a new user, I want to create an account and verify my identity so that I can access the platform while ensuring only real people can join.
* **Acceptance criteria**:
  * User can register with email and password
  * User can upload government ID for verification
  * System generates ZK proof of identity without storing personal details
  * User receives confirmation of successful verification
  * Account is marked as verified upon successful ID validation

### 10.2. Privacy-preserving preference setting

* **ID**: GH-002
* **Description**: As a verified user, I want to set my dating preferences privately so that the system can match me with compatible people without revealing my specific criteria.
* **Acceptance criteria**:
  * User can set age range preferences
  * User can set location proximity preferences
  * User can set income bracket preferences
  * User can set education level preferences
  * Preferences are stored locally and never transmitted in plain text
  * User can modify preferences at any time

### 10.3. ZK-proof-based compatibility matching

* **ID**: GH-003
* **Description**: As a user, I want to be matched with people who meet my criteria and whose criteria I meet, verified through cryptographic proofs rather than self-reported information.
* **Acceptance criteria**:
  * System generates matches based on mutual compatibility
  * Compatibility is verified through ZK proofs
  * Users can see compatibility percentage without seeing specific attributes
  * System prevents matches where preferences don't align mutually
  * Users can request additional verification proofs from matches

### 10.4. Secure profile creation with selective disclosure

* **ID**: GH-004
* **Description**: As a user, I want to create an attractive profile while controlling exactly what information is revealed vs. proven cryptographically.
* **Acceptance criteria**:
  * User can upload photos and write bio
  * User can choose which verified attributes to display
  * User can generate proofs for specific claims without revealing exact values
  * Profile shows verification status for different attributes
  * User can adjust privacy settings for different types of information

### 10.5. Encrypted communication with verified matches

* **ID**: GH-005
* **Description**: As a matched user, I want to communicate securely with my matches while maintaining privacy until I choose to reveal more information.
* **Acceptance criteria**:
  * Matched users can send encrypted messages
  * Users can selectively disclose additional verified information
  * Chat interface shows verification status of shared claims
  * Users can report or block inappropriate behavior
  * Message history is encrypted and stored locally

### 10.6. Location verification without revealing exact address

* **ID**: GH-006
* **Description**: As a user, I want to prove I'm within a certain distance of potential matches without revealing my exact location.
* **Acceptance criteria**:
  * User can set location-based preferences
  * System can verify proximity without storing exact addresses
  * Users can prove they're within specified radius of matches
  * Location data is never transmitted or stored in plain text
  * Users can adjust location privacy radius

### 10.7. Income verification without revealing exact salary

* **ID**: GH-007
* **Description**: As a user, I want to verify my income bracket to attract compatible matches without revealing my exact salary.
* **Acceptance criteria**:
  * User can upload income verification documents
  * System generates proof of income bracket (e.g., $50k-$75k) without storing exact amount
  * Income verification status is shown on profile
  * Users can set income bracket preferences for matches
  * Verification can be updated periodically

### 10.8. Education level verification

* **ID**: GH-008
* **Description**: As a user, I want to verify my education level to connect with similarly educated matches while maintaining privacy about specific institutions.
* **Acceptance criteria**:
  * User can verify education level (high school, bachelor's, master's, PhD)
  * System doesn't store specific institution names
  * Education verification badge appears on profile
  * Users can set education preferences for potential matches
  * Multiple education credentials can be verified

### 10.9. Sybil resistance and one-account-per-person enforcement

* **ID**: GH-009
* **Description**: As a user, I want assurance that each person can only create one account so that the platform maintains authenticity and prevents spam.
* **Acceptance criteria**:
  * System prevents multiple accounts per government ID
  * ID information is salted and hashed for privacy
  * Users attempting to create duplicate accounts are blocked
  * Clear error messages explain one-account policy
  * Account recovery process for legitimate users

### 10.10. Match quality feedback and algorithm improvement

* **ID**: GH-010
* **Description**: As a user, I want to provide feedback on match quality so that the system can improve future recommendations.
* **Acceptance criteria**:
  * Users can rate match quality after conversations
  * Feedback is collected without revealing specific match details
  * Algorithm adjusts based on aggregated feedback
  * Users can see their match success statistics
  * Feedback system includes options for reporting fake profiles

### 10.11. Privacy dashboard and data control

* **ID**: GH-011
* **Description**: As a privacy-conscious user, I want complete visibility and control over my data and proofs so that I can make informed decisions about what to share.
* **Acceptance criteria**:
  * Dashboard shows all generated proofs and their status
  * User can revoke specific proofs or permissions
  * Clear explanation of what data is stored where
  * User can export or delete their data
  * Activity log shows all privacy-related actions

### 10.12. Professional verification through LinkedIn integration

* **ID**: GH-012
* **Description**: As a career-focused user, I want to optionally verify my professional status through LinkedIn while maintaining privacy about my specific employer.
* **Acceptance criteria**:
  * Optional LinkedIn connection for professional verification
  * System verifies employment status without storing company details
  * Professional verification badge appears on profile
  * Users can disconnect LinkedIn integration at any time
  * Job title categories are verified without revealing specific positions