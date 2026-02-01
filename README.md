# 🔐 CryptoVault: Secure File Sharing System

CryptoVault is a secure file-sharing system designed to address the rising threats of data breaches, unauthorised access, and file tampering in cloud-based collaboration. The system combines **Fernet and AES hybrid cryptography**, **SHA-256 integrity hashing**, and **blockchain-based ledger logging** with **AWS cloud storage integration** to ensure end-to-end encryption and immutable audit trails.

---

## 📖 About the Project

In today's hyper-connected digital landscape, secure file sharing is a necessity. Traditional methods often lack strong encryption or tamper-proof logs, creating serious trust issues.

**CryptoVault** aims to solve these problems by providing a system where files can be transferred securely while remaining private, tamper-proof, and accessible only to authorised users. It bridges the gap between **cryptography**, **blockchain**, and **cloud storage** to create a comprehensive, secure file-sharing ecosystem.

---

## ❗ Problem Statement

Most existing file-sharing systems suffer from the following limitations:

- **Lack of strong encryption mechanisms**  
  Many platforms use outdated or weak encryption methods—or none at all.

- **Insecure key management**  
  Encryption keys are often poorly stored; once exposed, security collapses.

- **No tamper-proof audit trails**  
  There is usually no way to prove that a file has not been altered after sharing.

- **Poor scalability**  
  Systems often struggle with large files or seamless cloud integration.

---

## ✨ Key Features

- **🔒 End-to-End Encryption**  
  Files are encrypted on the sender’s side using **Fernet (symmetric encryption)**.  
  Encryption keys are securely shared using **AES**.

- **🧾 Integrity Verification**  
  Uses **SHA-256 hashing** to generate a unique digital fingerprint for every file.  
  Any modification changes the hash, immediately signalling tampering.

- **⛓ Tamper-Proof Audit Trails**  
  Implements a **blockchain-inspired hash chain**.  
  Each file upload generates a cryptographic hash linked to the previous record, making logs immutable.

- **☁ Scalable Cloud Storage**  
  Integrates **AWS S3** for secure and scalable storage.  
  Access is controlled using **AWS IAM policies** and **pre-signed URLs**.

- **👤 User-Centric Workflow**  
  Provides a clean interface for:
  - File encryption
  - File decryption
  - Automatic detection of encrypted files

---

## 🏗 System Architecture

CryptoVault follows a **three-pillar architecture**:

### 1️⃣ Sender (User A)
- Authenticates via secure login.
- Selects a file and encrypts it using a **Fernet Key**.
- Generates a **SHA-256 hash** of the encrypted file.
- Uploads the encrypted file using an **AWS S3 Pre-signed URL**.

### 2️⃣ Cloud & Blockchain Infrastructure
- **AWS S3**  
  Stores encrypted files securely.
- **AWS IAM**  
  Handles role-based access control.
- **Custom Django Blockchain**  
  Maintains immutable audit trails containing:
  - File hash
  - Metadata
  - Timestamp

### 3️⃣ Receiver (User B)
- Downloads the encrypted file via an **S3 Pre-signed URL**.
- Decrypts the file using the secure **AES Key**.
- Verifies file integrity using **SHA-256** against blockchain records.

---

## 🛠 Technology Stack

| Component        | Technology        | Purpose |
|------------------|------------------ |--------|
| Language         | Python            | Core programming language |
| Frontend         | React / JavaScript| User interface and dashboard |
| Backend          | Django / Python   | Authentication & blockchain logic |
| Cryptography     | cryptography Lib  | Fernet key generation & encryption |
| Hashing          | hashlib           | SHA-256 integrity verification |
| Cloud Storage    | AWS S3            | Encrypted file storage |
| Security         | AWS IAM           | Role-based access control |

---

## 👥 Team & Acknowledgements

### 🎓 Institution
**Jaypee Institute of Information Technology, Noida**

### 👨‍💻 Project Team
- **Mudit Rastogi**  
- **Samradhi Kaushal**  
- **Deepanshu Khurana**  

---

## ⚠ Disclaimer

This project was submitted as part of the **B. Tech CSE curriculum** and is intended strictly for **academic and educational purposes**.

---
## Screenshots 
|Image                                                                                                                             | Desc |
|----------------------------------------------------------------------------------------------------------------------------------|------|
|<img width="828" height="418" alt="image" src="https://github.com/user-attachments/assets/8398c743-f943-4d61-8c84-6ee503d615fb" />| Sharing Page | 
|<img width="925" height="524" alt="image" src="https://github.com/user-attachments/assets/8b32ebb4-d381-431e-b248-ee7f608f529d" /> | Upload Interface| 
|<img width="644" height="481" alt="image" src="https://github.com/user-attachments/assets/7f1ff8f8-7c43-409c-aeb9-fcc5d7e7b6cd" /> | AWS Bucket | 
|<img width="727" height="310" alt="image" src="https://github.com/user-attachments/assets/0543deb8-911b-4acd-8e10-4f1ec44fa8f6" /> | User Dashboard |
|<img width="926" height="377" alt="image" src="https://github.com/user-attachments/assets/4e5a7ca3-8521-4741-8a47-507ceea410d5" /> | Decryption Key Tables |
