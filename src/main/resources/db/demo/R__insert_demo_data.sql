MERGE INTO WORKSPACE_USER TARGET
    USING (
        SELECT
            'isolation@workspace.app' AS EMAIL,
            '$2a$10$z7CcN83DE8XeFlUy3r2z3.iqfsFFoiol1kNKVtewur2tqQEQcnLtq'
                                      AS PASSWORD_HASH,
            'ISOLATION TEST' AS USER_NAME
        FROM DUAL
    ) SOURCE
    ON (
        TARGET.EMAIL = SOURCE.EMAIL
        )
    WHEN MATCHED THEN
        UPDATE SET
            TARGET.PASSWORD_HASH =
                    SOURCE.PASSWORD_HASH,
            TARGET.USER_NAME =
                    SOURCE.USER_NAME
    WHEN NOT MATCHED THEN
        INSERT (
                EMAIL,
                PASSWORD_HASH,
                USER_NAME
            )
            VALUES (
                       SOURCE.EMAIL,
                       SOURCE.PASSWORD_HASH,
                       SOURCE.USER_NAME
                   );

MERGE INTO MEMO_FOLDER TARGET
    USING (
        SELECT
            USER_ID,
            'INBOX' AS FOLDER_NAME,
            'Y' AS IS_SYSTEM
        FROM WORKSPACE_USER
        WHERE EMAIL =
              'isolation@workspace.app'
    ) SOURCE
    ON (
        TARGET.USER_ID = SOURCE.USER_ID
            AND TARGET.FOLDER_NAME =
                SOURCE.FOLDER_NAME
        )
    WHEN MATCHED THEN
        UPDATE SET
            TARGET.IS_SYSTEM =
                    SOURCE.IS_SYSTEM
    WHEN NOT MATCHED THEN
        INSERT (
                USER_ID,
                FOLDER_NAME,
                IS_SYSTEM
            )
            VALUES (
                       SOURCE.USER_ID,
                       SOURCE.FOLDER_NAME,
                       SOURCE.IS_SYSTEM
                   );

MERGE INTO WORKSPACE_USER TARGET
    USING (
        SELECT
            'demo@workspace.app' AS EMAIL,
            '$2a$10$z7CcN83DE8XeFlUy3r2z3.iqfsFFoiol1kNKVtewur2tqQEQcnLtq'
                                 AS PASSWORD_HASH,
            'DEMO USER' AS USER_NAME
        FROM DUAL
    ) SOURCE
    ON (
        TARGET.EMAIL = SOURCE.EMAIL
        )
    WHEN MATCHED THEN
        UPDATE SET
            TARGET.PASSWORD_HASH = SOURCE.PASSWORD_HASH,
            TARGET.USER_NAME = SOURCE.USER_NAME
    WHEN NOT MATCHED THEN
        INSERT (
                EMAIL,
                PASSWORD_HASH,
                USER_NAME
            )
            VALUES (
                       SOURCE.EMAIL,
                       SOURCE.PASSWORD_HASH,
                       SOURCE.USER_NAME
                   );

MERGE INTO MEMO_FOLDER TARGET
    USING (
        SELECT
            USER_ID,
            'INBOX' AS FOLDER_NAME,
            'Y' AS IS_SYSTEM
        FROM WORKSPACE_USER
        WHERE EMAIL = 'demo@workspace.app'
    ) SOURCE
    ON (
        TARGET.USER_ID = SOURCE.USER_ID
            AND TARGET.FOLDER_NAME = SOURCE.FOLDER_NAME
        )
    WHEN MATCHED THEN
        UPDATE SET
            TARGET.IS_SYSTEM = SOURCE.IS_SYSTEM
    WHEN NOT MATCHED THEN
        INSERT (
                USER_ID,
                FOLDER_NAME,
                IS_SYSTEM
            )
            VALUES (
                       SOURCE.USER_ID,
                       SOURCE.FOLDER_NAME,
                       SOURCE.IS_SYSTEM
                   );