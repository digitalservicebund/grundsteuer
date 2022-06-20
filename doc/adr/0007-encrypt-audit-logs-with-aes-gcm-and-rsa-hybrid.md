# 7. Encrypt audit logs with AES-GCM and RSA hybrid encryption

Date: 2022-05-13

## Status

Accepted

## Context

Our goal is to store audit logs in a way that ensures the privacy of the information. To guarantee that the stored information is only accessible by authorized personnel, we want the app to be able to write information to the audit logs, but unable to read that information.

## Decision

We use a hybrid encryption scheme to encrypt the data. Asymmetric encryption allows us to encrypt, but not to decrypt the information using a public key, while the authorized personell who is in possession of the private key is the sole entity able to decrypt the information. Since asymmetric encryption is expensive, we do not use it to encrypt the data directly, but to encrypt a randomly-generated symmetric key which in turn is used for the data encryption.
Specifically, we use AES in GCM mode with a 128-bit key and RSA with a key length of 4096 bit. The data is encrypted using AES. The symmetric key is created individually for each entry and is then encrypted using the public key of the RSA key pair. The encrypted data, the encrypted key and a version number are concatenated and stored together as one entry.

AES in GCM mode was chosen because it provides built-in authentication. The vulnerability of a repeated nonce is mitigated because we use each symmetric key only for one entry. Therefore, the key is not repeated and neither is the nonce.

The nonce for AES and the auth tag have both a length of 128 bit.

The selection of the encryption algorithms, key lengths and configurations is based on the specifications of the BSI ([BSI TR-02102-1](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/TechnischeRichtlinien/TR02102/BSI-TR-02102.pdf;jsessionid=FC02677A5D88D1742F449BB900DD1F64.internet082?__blob=publicationFile&v=5)).

## Consequences

The app and developers are only able to encrypt data using the public key of the encryption scheme. The private key needs to be stored securely by the authorized personnel.
We need to pay attention to the cryptographic algorithms used because they might become unsupported in future BSI specifications or there might be vulnerabilities in their specific implementation.
If we ever need to change the public key in the future because of key rotation, we will have to change the version number to be able to differentiate between differently encrypted entries.
