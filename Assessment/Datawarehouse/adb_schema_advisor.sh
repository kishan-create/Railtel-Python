#!/bin/bash
##############################################################################################################################
# Filename     : adb_schema_advisor.sh
# Purpose      : Run to capture schema details for any database to be migrated to ADW/ATP/ATPD
# Build Date   : 25-Feb-2019
# Last Revision: 14-May-2020
# Version      : 2.0
# Notes        : Execute as ./adb_schema_advisor.sh <conn_string> <schema_name> <workload_type>
#--------------------------------------------------------------------------------------------------------------------------
#############################################################################################################################

if [ "$#" -lt 3 ]; then
  echo Usage: $0 "<conn_string> <schema_name> <workload_type>" 
  echo Usage: Please provide above information "<conn_string> <schema_name> <workload_type>"
  exit 1
fi;
conn_string=`echo "$1"`
schema_name=`echo "$2"`
workload_type=`echo "$3"`
sys_table_name="sys.v_\$instance"

echo 'Please wait! Script Execution is in progress..........'  

spool_filename=`sqlplus -s "${conn_string}" << EOF 
set linesize 300;
set feedback off;
set heading off;
set echo off;
set pages 0;
col count for 99
--- begin block make LST file names ----------
SELECT UPPER('ADW')||'_'|| host_name||'_'||instance_name||'_v'|| replace(version,'.') ||to_char(sysdate,'_ddMonYYYY_HH24MI') ||'.LST' here_lst_file_name from ${sys_table_name} where rownum<2; 
EOF`
while read schema_name_part
do
sqlplus -s "${conn_string}" << EOF >> /dev/null
set echo off;
set feedback off;
set verify off;
set pagesize 10000;
set serveroutput on size 1000000;
SET TERMOUT OFF;
set heading off;

SPOOL ${spool_filename} APPEND;
COLUMN DB_NAME FORMAT A7;
COLUMN Multitenant_Option FORMAT A20;
COLUMN Endianness FORMAT A10;
SET MARKUP HTML ON ENTMAP OFF;
set linesize 200;
set trimspool on;
set heading on;

SET SERVEROUTPUT ON
-----------------------------------------
--Prompt Heading U_I_GG DB:Reporting Date|
-----------------------------------------
PROMPT Heading U_I_GG DB:Reporting Date
SELECT 'DATE_AND_TIME='||to_char(sysdate,'DD-Mon-YYYY HH24:MI:SS') date_N_time from dual;

DECLARE
    TYPE T_REFCUR IS REF CURSOR;

    TYPE T_OBJECT_REC IS RECORD (
        ID           NUMBER,
        OBJECT_NAME  VARCHAR2(256)
    );

    TYPE T_SUMMARY_REC IS RECORD (
        OBJECT_TYPE  VARCHAR2(128),
        OBJECT_CNT   NUMBER,
        REJECT_CNT   NUMBER,
        MODIFIED_CNT NUMBER
    );

    TYPE T_DETAIL_REC IS RECORD (
        ID              NUMBER,
        ADB_TYPE        VARCHAR2(128),
        OWNER           VARCHAR2(128),
        OBJECT_NAME     VARCHAR2(128),
        SUBOBJECT_NAME  VARCHAR2(128),
        OBJECT_TYPE     VARCHAR2(128),
        SUBOBJECT_TYPE  VARCHAR2(128),
        REJECTED        VARCHAR2(1),
        MODIFIED        VARCHAR2(1)
    );

    TYPE T_OBJLIST IS TABLE OF T_OBJECT_REC INDEX BY BINARY_INTEGER;
    TYPE T_DETAIL IS TABLE OF T_DETAIL_REC INDEX BY BINARY_INTEGER;
    TYPE T_SUMMARY IS TABLE OF T_SUMMARY_REC INDEX BY BINARY_INTEGER;

    G_COLS_IN_OUTPUT      PLS_INTEGER:=3;
PROCEDURE PRINTUSAGE AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('--');
    DBMS_OUTPUT.PUT_LINE('-- Example Usage:');
    DBMS_OUTPUT.PUT_LINE('--');
    DBMS_OUTPUT.PUT_LINE('-- SQL> EXEC ADB_ADVISOR.REPORT(''<Schema>'', ''<ADB Type>'');');
    DBMS_OUTPUT.PUT_LINE('--');
    DBMS_OUTPUT.PUT_LINE('-- Where:');
    DBMS_OUTPUT.PUT_LINE('--');
    DBMS_OUTPUT.PUT_LINE('-- <Schema>  : Schema to be Analyzed');
    DBMS_OUTPUT.PUT_LINE('-- <ADB Type>: ''ATP'' - Autonomous Transaction Processing (Serverless)');
    DBMS_OUTPUT.PUT_LINE('--           : ''ATPD'' - Autonomous Transaction Processing (Dedicated)');
    DBMS_OUTPUT.PUT_LINE('--           : ''ADW'' - Autonomous Data Warehouse (Serverless)');
END PRINTUSAGE;

PROCEDURE PRINTARRAY (I_IDLIST IN OUT NOCOPY T_OBJLIST, I_SHORTTEXT IN VARCHAR2, I_LONGTEXT IN VARCHAR2, I_SINGLE IN VARCHAR2 DEFAULT 'N', I_COUNT IN PLS_INTEGER DEFAULT 0)
AS
    L_PRINTED   PLS_INTEGER := 1;
    L_INSTR     VARCHAR2(4000);
    L_OUTSTR    VARCHAR2(4000);
    L_NEWPOS    PLS_INTEGER:=1;
    L_CURPOS    PLS_INTEGER:=1;
BEGIN
    IF NOT I_IDLIST.COUNT > 0 THEN RETURN; END IF;

    IF (I_SHORTTEXT IS NOT NULL)
    THEN
        DBMS_OUTPUT.PUT_LINE(I_SHORTTEXT||' (Count='||(CASE WHEN I_COUNT > 0 THEN I_COUNT ELSE I_IDLIST.COUNT END)||'):');
		DBMS_OUTPUT.PUT_LINE('<agd>');
        DBMS_OUTPUT.PUT_LINE(RPAD('-', LENGTH(I_SHORTTEXT||' (Count='||I_IDLIST.COUNT||'):'), '-'));
		DBMS_OUTPUT.PUT_LINE('<agd>');
    END IF;

    IF (I_LONGTEXT IS NOT NULL)
    THEN
        WHILE (TRUE)
        LOOP
            L_NEWPOS := INSTR(I_LONGTEXT, ' ', L_NEWPOS+80, 1);
            IF L_NEWPOS < L_CURPOS
            THEN
                DBMS_OUTPUT.PUT_LINE(SUBSTR(I_LONGTEXT, L_CURPOS));
                EXIT;
            ELSE
                DBMS_OUTPUT.PUT_LINE(SUBSTR(I_LONGTEXT, L_CURPOS, L_NEWPOS-L_CURPOS));
            END IF;
            L_CURPOS := L_NEWPOS+1;
        END LOOP;
 --       DBMS_OUTPUT.NEW_LINE();
    END IF;

    IF I_SINGLE = 'N'
    THEN
        FOR I IN 1..I_IDLIST.COUNT
        LOOP
            L_OUTSTR := NVL(L_OUTSTR, '')||RPAD(SUBSTR(I_IDLIST(I).OBJECT_NAME,1,44), 38, ' ');

            IF L_PRINTED = G_COLS_IN_OUTPUT
            THEN
                DBMS_OUTPUT.PUT_LINE(L_OUTSTR);
                L_OUTSTR := NULL;
                L_PRINTED := 1;
            ELSE
                L_PRINTED := L_PRINTED + 1;
            END IF;
        END LOOP;

        
        IF L_PRINTED >= 1
        THEN
                DBMS_OUTPUT.PUT_LINE(L_OUTSTR);
                L_OUTSTR := NULL;
                L_PRINTED := 1;
        END IF;
    ELSE
        FOR I IN 1..I_IDLIST.COUNT
        LOOP
            DBMS_OUTPUT.PUT_LINE(I_IDLIST(I).OBJECT_NAME);
        END LOOP;
    END IF;
    DBMS_OUTPUT.NEW_LINE();
END PRINTARRAY;

PROCEDURE PRINTARRAY_WITHEAD (I_IDLIST IN OUT NOCOPY T_OBJLIST, I_SHORTTEXT IN VARCHAR2, I_LONGTEXT IN VARCHAR2, I_HEADER1 IN VARCHAR2, I_HEADER2 IN VARCHAR2)
AS
    L_PRINTED   PLS_INTEGER := 1;
    L_INSTR     VARCHAR2(4000);
    L_OUTSTR    VARCHAR2(4000);
    L_NEWPOS    PLS_INTEGER:=1;
    L_CURPOS    PLS_INTEGER:=1;
BEGIN
    IF NOT I_IDLIST.COUNT > 0 THEN RETURN; END IF;

    IF (I_SHORTTEXT IS NOT NULL)
    THEN
        DBMS_OUTPUT.PUT_LINE(I_SHORTTEXT||' (Count='||I_IDLIST.COUNT||'):');
        DBMS_OUTPUT.PUT_LINE(RPAD('-', LENGTH(I_SHORTTEXT||' (Count='||I_IDLIST.COUNT||'):'), '-'));
    END IF;

    IF (I_LONGTEXT IS NOT NULL)
    THEN
        WHILE (TRUE)
        LOOP
            L_NEWPOS := INSTR(I_LONGTEXT, ' ', L_NEWPOS+80, 1);
            IF L_NEWPOS < L_CURPOS
            THEN
                DBMS_OUTPUT.PUT_LINE(SUBSTR(I_LONGTEXT, L_CURPOS));
                EXIT;
            ELSE
                DBMS_OUTPUT.PUT_LINE(SUBSTR(I_LONGTEXT, L_CURPOS, L_NEWPOS-L_CURPOS));
            END IF;
            L_CURPOS := L_NEWPOS+1;
        END LOOP;
        DBMS_OUTPUT.NEW_LINE();
    END IF;

    IF (I_HEADER1 IS NOT NULL)
    THEN
        DBMS_OUTPUT.PUT_LINE(I_HEADER1);
    END IF;

    IF (I_HEADER2 IS NOT NULL)
    THEN
        DBMS_OUTPUT.PUT_LINE(I_HEADER2);
    END IF;

    FOR I IN 1..I_IDLIST.COUNT
    LOOP
        DBMS_OUTPUT.PUT_LINE(I_IDLIST(I).OBJECT_NAME);
    END LOOP;
    DBMS_OUTPUT.NEW_LINE();
END PRINTARRAY_WITHEAD;

PROCEDURE ADDTO_LIST (I_IDLIST IN OUT NOCOPY T_OBJLIST, I_ID IN NUMBER, I_OBJECT_NAME IN VARCHAR2)
IS
    IDX   PLS_INTEGER;
BEGIN
    IF I_IDLIST.COUNT = 0 THEN IDX := 1; ELSE IDX := I_IDLIST.LAST+1; END IF;

    I_IDLIST(IDX).ID := I_ID;
    I_IDLIST(IDX).OBJECT_NAME := I_OBJECT_NAME;
END ADDTO_LIST;

FUNCTION GETCOUNT (I_SQL IN VARCHAR2, I_PARAM IN VARCHAR2 DEFAULT NULL) RETURN NUMBER
AS
    L_CUR       T_REFCUR;
    L_COUNT     PLS_INTEGER :=0;
BEGIN
    IF I_PARAM IS NULL
    THEN
        OPEN L_CUR FOR I_SQL;
    ELSE
        OPEN L_CUR FOR I_SQL USING I_PARAM;
    END IF;

    LOOP
        FETCH L_CUR INTO L_COUNT;
        EXIT WHEN L_CUR%NOTFOUND;
    END LOOP;

    CLOSE L_CUR;
    RETURN(L_COUNT);
EXCEPTION WHEN OTHERS THEN
    CLOSE L_CUR;
    RETURN(0);
END GETCOUNT;

PROCEDURE SAVE_SUMMARY (I_SUMMARY IN OUT NOCOPY T_SUMMARY, I_OBJECT_TYPE IN VARCHAR2, I_TOTAL IN NUMBER, 
    I_REJ IN NUMBER, I_MOD IN NUMBER)
IS
    IDX     PLS_INTEGER;
BEGIN
    
    IF I_SUMMARY.COUNT = 0 THEN IDX := 1; ELSE IDX := I_SUMMARY.LAST+1; END IF;
    I_SUMMARY(IDX).OBJECT_TYPE := I_OBJECT_TYPE;
    I_SUMMARY(IDX).OBJECT_CNT := I_TOTAL;
    I_SUMMARY(IDX).REJECT_CNT := I_REJ;
    I_SUMMARY(IDX).MODIFIED_CNT := I_MOD;
END SAVE_SUMMARY;

PROCEDURE SAVE_DETAIL (I_DETAIL IN OUT NOCOPY T_DETAIL, I_ID IN NUMBER, I_ADB_TYPE IN VARCHAR2, I_OWNER IN VARCHAR2,
    I_OBJECT_NAME IN VARCHAR2, I_SUBOBJECT_NAME IN VARCHAR2, I_OBJECT_TYPE IN VARCHAR2, I_SUBOBJECT_TYPE IN VARCHAR2,
    I_REJECTED IN VARCHAR2, I_MODIFIED IN VARCHAR2)
IS
    IDX     PLS_INTEGER;
BEGIN
    IF I_DETAIL.COUNT = 0 THEN IDX := 1; ELSE IDX := I_DETAIL.LAST+1; END IF;
    I_DETAIL(IDX).ID := I_ID;
    I_DETAIL(IDX).ADB_TYPE := I_ADB_TYPE;
    I_DETAIL(IDX).OWNER := I_OWNER;
    I_DETAIL(IDX).OBJECT_NAME := I_OBJECT_NAME;
    I_DETAIL(IDX).SUBOBJECT_NAME := I_SUBOBJECT_NAME;
    I_DETAIL(IDX).OBJECT_TYPE := I_OBJECT_TYPE;
    I_DETAIL(IDX).SUBOBJECT_TYPE := I_SUBOBJECT_TYPE;
    I_DETAIL(IDX).REJECTED := I_REJECTED;
    I_DETAIL(IDX).MODIFIED := I_MODIFIED;
END SAVE_DETAIL;

PROCEDURE REPORT (I_SCHEMA IN VARCHAR2, I_ADB_TYPE IN VARCHAR2)
AS

    L_ID                PLS_INTEGER:=0;
    L_MODIFIED          VARCHAR2(1);
    L_REJECTED          VARCHAR2(1);
    L_DATA_FOUND        PLS_INTEGER:=0;
    L_TEXT_FOUND        VARCHAR2(256);
    L_NOLOGGING_CNT     PLS_INTEGER:=0;
    L_INMEMORY_CNT      PLS_INTEGER:=0;
    L_COLBYTE_CNT       PLS_INTEGER:=0;
    L_ILMOBJECTS_EXIST  PLS_INTEGER:=0;
    L_INMEMORYCOL_EXIST PLS_INTEGER:=0;
    L_MAINTAINEDCOL_EXIST PLS_INTEGER:=0;

    L_OBJECT_CNT        PLS_INTEGER;
    L_OBJECT_REJ_CNT    PLS_INTEGER;
    L_OBJECT_MOD_CNT    PLS_INTEGER;
    L_OBJECT_TYPE_PREV  VARCHAR2(128);

    L_XMLSCHEMAS_EXIST  PLS_INTEGER;
    L_XMLSCHEMAS_CNT    PLS_INTEGER;
    L_XMLSCHEMAS_REJ_CNT PLS_INTEGER;
    L_XMLTABLES_EXIST   PLS_INTEGER;
    L_XMLTABLES_CNT     PLS_INTEGER;
    L_XMLTABLES_REJ_CNT PLS_INTEGER;
    L_XMLTABCOLS_EXIST  PLS_INTEGER;

    L_DETAIL            T_DETAIL;    
    L_SUMMARY           T_SUMMARY;
    L_ADB_TYPE          VARCHAR2(10);
    L_CURS              T_REFCUR;

    L_REJ4              T_OBJLIST;
    L_REJ4_SHORT_DESC   VARCHAR2(4000):='In-Database JAVA objects not migrated';
    L_REJ4_LONG_DESC    VARCHAR2(4000):='Note: In-Database Java Objects are currently not suported in Autonomous Database.';

    L_REJ5              T_OBJLIST;
    L_REJ5_SHORT_DESC   VARCHAR2(4000):='XMLType Tables not migrated';
    L_REJ5_LONG_DESC    VARCHAR2(4000):='Note: XMLType Tables with CLOB or Object-Relational storage is not supported in Autonomous Database. Use the BINARY storage option instead.';

    L_REJ6              T_OBJLIST;
    L_REJ6_SHORT_DESC   VARCHAR2(4000):='Tables with XMLType Columns not migrated';
    L_REJ6_LONG_DESC    VARCHAR2(4000):='Note: Tables with XMLType columns defined with CLOB or Object-Relational storage are not supported in Autonomous Database. Use the BINARY storage option instead.';

    L_REJ7              T_OBJLIST;
    L_REJ7_SHORT_DESC   VARCHAR2(4000):='XML Schema Objects not migrated';
    L_REJ7_LONG_DESC    VARCHAR2(4000):='Note: XML Schemas are not supported in Autonomous Database.';

    L_REJ8              T_OBJLIST;
    L_REJ8_SHORT_DESC   VARCHAR2(4000):='Database Directory Objects not migrated';
    L_REJ8_LONG_DESC    VARCHAR2(4000):='Note: Database Directory objects are not allowed in Autonomous Database.';

    L_REJ9              T_OBJLIST;
    L_REJ9_SHORT_DESC   VARCHAR2(4000):='Tables with Media data types not migrated';
    L_REJ9_LONG_DESC    VARCHAR2(4000):='Note: Columns with Media data types are not allowed in Autonomous Database. Consider using SecureFiles LOB as Oracle Multimedia is desupported in 19c.';


    L_REJ11             T_OBJLIST;
    L_REJ11_SHORT_DESC  VARCHAR2(4000):='Tables with LONG/LONG RAW data types not migrated';
    L_REJ11_LONG_DESC   VARCHAR2(4000):='Note: In ADW, Tables with LONG/LONG RAW data types are not created when the table has a HCC compression clause or compression is DISABLED - which means the table will be HCC compressed by default on ADW. You may modify the compression level on the source to non-HCC to make the table migrate to ADW via Data Pump, or create the table manually on ADW with compression disabled.';
    
    L_MOD1              T_OBJLIST;
    L_MOD1_SHORT_DESC   VARCHAR2(4000):='BASICFILE LOBs changed to SECUREFILE LOBs';
    L_MOD1_LONG_DESC    VARCHAR2(4000):='Note: Table has BASICFILE LOBs. All Basicfile LOBs will be automatically converted to SECUREFILE LOBs at import time.';

    L_MOD2              T_OBJLIST;
    L_MOD2_SHORT_DESC   VARCHAR2(4000):='NOLOGGING storage attribute will be changed to LOGGING';
    L_MOD2_LONG_DESC    VARCHAR2(4000):='Note: Table, Partition or Subpartition created with NOLOGGING will automatically be created in ATP and ADW as LOGGING.';

    L_MOD3              T_OBJLIST;
    L_MOD3_SHORT_DESC   VARCHAR2(4000):='External Table will be created as regular table';
    L_MOD3_LONG_DESC    VARCHAR2(4000):='Note: Consider using DBMS_CLOUD package on ADB to create External Tables that use Cloud Object Storage. If you try to create a non-Cloud Object Storage External table, it will be created as a non-External table.';

    L_MOD4              T_OBJLIST;
    L_MOD4_SHORT_DESC   VARCHAR2(4000):='Index Organized table will be created as regular table';
    L_MOD4_LONG_DESC    VARCHAR2(4000):='Note: Index Organized tables are disallowed in ADB. When you create an IOT in ADB, the table gets created as non-IOT (regular table). When the Data Pump export file contains tables with IOT, use ''dwcs_cvt_iots:y'' transformation at import time to transform IOTs are regular tables.';

    L_MOD5              T_OBJLIST;
    L_MOD5_SHORT_DESC   VARCHAR2(4000):='Table Cluster will be created as regular table';
    L_MOD5_LONG_DESC    VARCHAR2(4000):='Note: Table Clusters are disallowed in ADB. When you create a table with a CLUSTER clause on the ADB, the table gets created as a regular table.';

    L_MOD6              T_OBJLIST;
    L_MOD6_SHORT_DESC   VARCHAR2(4000):='ILM ADO Policies not migrated';
    L_MOD6_LONG_DESC    VARCHAR2(4000):='Note: Tables with ILM ADO Policies (12c and later) will be created without the ILM ADO Policy in ATP adn ADW.';

    L_MOD7              T_OBJLIST;
    L_MOD7_SHORT_DESC   VARCHAR2(4000):='INMEMORY Clause will be removed';
    L_MOD7_LONG_DESC    VARCHAR2(4000):='Note: Database In-Memory is not enabled in ADB. All In-Memory tables and partitions will be created with NO INMEMORY clause.';

    L_MOD8              T_OBJLIST;
    L_MOD8_SHORT_DESC   VARCHAR2(4000):='DB Links needs to be re-created';
    L_MOD8_LONG_DESC    VARCHAR2(4000):='Note: The following Database Links needs to be created manually in ADB using DBMS_CLOUD_ADMIN.CREATE_DATABASE_LINK.';

    L_MOD9              T_OBJLIST;
    L_MOD9_SHORT_DESC   VARCHAR2(4000):='Synonyms with DB Links needs attention';
    L_MOD9_LONG_DESC    VARCHAR2(4000):='Note: Ensure the DB Links used by the Synonyms are recreated manually in ADB using DBMS_CLOUD_ADMIN.CREATE_DATABASE_LINK.';
    
    
    L_INFO1             T_OBJLIST;
    L_INFO1_SHORT_DESC  VARCHAR2(4000):='Tables and Partitions will be Compressed to QUERY HIGH';
    L_INFO1_LONG_DESC   VARCHAR2(4000):='Note: In ADW, when the table or partition DDL does not contain a COMPRESSION clause, it will be created with a default compression of QUERY HIGH. To change this behavior, either add a compression clause of your choice prior to the DDL export or alter the table after import in ADW to your desired compression type (you can disable the compression using NOCOMPRESS).';

    L_INFO2             T_OBJLIST;
    L_INFO2_SHORT_DESC  VARCHAR2(4000):='Parallel DEGREE > 1 specified on INDEX';
    L_INFO2_LONG_DESC   VARCHAR2(4000):='Note: If a PARALLEL clause is specified on the index in your current database, it remains with the index when it gets created, via data pump or manual, in both ATP Serverless and Dedicated. This can lead to SQL statements running in parallel unbeknownst to the end user. To specify serial execution, change the INDEX parallel clause to NOPARALLEL or set the PARALLEL degree to 1.';

    L_INFO3             T_OBJLIST;
    L_INFO3_SHORT_DESC  VARCHAR2(4000):='Tablespaces not created in ATP and ADW (Serverless)';
    L_INFO3_LONG_DESC   VARCHAR2(4000):='Note: Creation of tablespaces is disallowed in ATP and ADW (Serverless). The tablespace clause gets ignored and all objects get created in ''DATA'' tablespace.';

    L_INFO4             T_OBJLIST;
    L_INFO4_SHORT_DESC  VARCHAR2(4000):='Single-byte characterset in-use';
    L_INFO4_LONG_DESC   VARCHAR2(4000):='Note: Characterset used by the Autonomous Database is AL32UTF8 (Multi-byte). If you have a single-byte characterset (e.g. US7ASCII), it will convert to multi-byte at import time by Data Pump. However, if you are using BYTE semantics for data types, some values may not fit as they now take more bytes. Ensure that you transform to character semantics for data types.';

    L_INFO5             T_OBJLIST;
    L_INFO5_SHORT_DESC  VARCHAR2(4000):='Columns defined with BYTE semantics in a single-byte DB characterset';
    L_INFO5_LONG_DESC   VARCHAR2(4000):='Note: Characterset used by the Autonomous Database is AL32UTF8 (Multi-byte). But if you create a table with a column that uses BYTE semantics, it may not allow you to fit all characters as "Multi-byte" needs more bytes to store one character. Ensure that your BYTE columns are transformed to CHARACTER semantics before the migration as Oracle Data Pump currently does not do this.';

    L_INFO6             T_OBJLIST;
    L_INFO6_SHORT_DESC  VARCHAR2(4000):='User attributes for '''||I_SCHEMA||''' will be altered';
    L_INFO6_LONG_DESC   VARCHAR2(4000):=NULL;

    L_INFO7             T_OBJLIST;
    L_INFO7_SHORT_DESC  VARCHAR2(4000):='User PROFILEs not migrated';
    L_INFO7_LONG_DESC   VARCHAR2(4000):='Note: In ATP and ADW, all users will be assigned the ''DEFAULT'' Profile. Additionally, you are not allowed to create additional User PROFILEs.';

    L_INFO8             T_OBJLIST;
    L_INFO8_SHORT_DESC  VARCHAR2(4000):='DEFAULT user PROFILE will be altered';
    L_INFO8_LONG_DESC   VARCHAR2(4000):='Note: In ATP and ADW, User''s profile will be set to ''DEFAULT'', and you are not allowed to creat additional PROFILEs. Below are the differences in '''||I_SCHEMA||''' user''s current profile and the DEFAULT profile in ADW/ATP.';

    L_INFO9             T_OBJLIST;
    L_INFO9_SHORT_DESC  VARCHAR2(4000):='Database Options currently in use but not available in ADB';
    L_INFO9_LONG_DESC   VARCHAR2(4000):='Note: The following Database Options are detected as being used. ADB does not have these Options installed. Please verify if the application/schema to be migrated depends on these options.';

    L_INFO10            T_OBJLIST;
    L_INFO10_SHORT_DESC VARCHAR2(4000):='Database Parameters are set in your database but can''t be set in ADB';
    L_INFO10_LONG_DESC  VARCHAR2(4000):='Note: The following init parameters are set in your database that you would not be able to set in ADB. Please refer to the Oracle Autonomous Database documentation on the parameters that you are allowed to modify/set in the autonomous database.';

BEGIN    
    
    IF I_ADB_TYPE NOT IN ('ATP','ADW','ATPD')
    THEN
        PRINTUSAGE;
        RETURN;
    END IF;    
    
    L_DATA_FOUND := 0;
    L_DATA_FOUND := GETCOUNT('SELECT COUNT(1) FROM DBA_USERS WHERE USERNAME = :1', I_SCHEMA);

    IF (L_DATA_FOUND = 0)
    THEN
        DBMS_OUTPUT.PUT_LINE('-- Schema '''||I_SCHEMA||''' does not exist in this Database. Please check the schema name and rerun.');
        RETURN;
    END IF;    
    
    
    L_ILMOBJECTS_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_OBJECTS WHERE OBJECT_NAME = :1','DBA_ILMOBJECTS');
    L_INMEMORYCOL_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_TAB_COLS WHERE TABLE_NAME = :1 AND COLUMN_NAME = ''INMEMORY''', 'DBA_TABLES');
    L_MAINTAINEDCOL_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_TAB_COLS WHERE TABLE_NAME = :1 AND COLUMN_NAME = ''ORACLE_MAINTAINED''', 'DBA_OBJECTS');
   
    
    L_XMLTABLES_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_OBJECTS WHERE OBJECT_NAME = :1','DBA_XML_TABLES');
    L_XMLTABCOLS_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_OBJECTS WHERE OBJECT_NAME = :1','DBA_XML_TAB_COLS');
    L_XMLSCHEMAS_EXIST := GETCOUNT('SELECT COUNT(1) FROM ALL_OBJECTS WHERE OBJECT_NAME = :1','DBA_XML_SCHEMAS');

    
    L_ID := 0;
    L_OBJECT_CNT := 0;
    L_OBJECT_REJ_CNT := 0;
    L_OBJECT_MOD_CNT := 0;
    L_OBJECT_TYPE_PREV := '#X#D#';

    
    FOR T_ROW IN (SELECT OWNER, OBJECT_NAME, SUBOBJECT_NAME, OBJECT_TYPE, SUBOBJECT_TYPE
                    FROM ((SELECT OWNER, OBJECT_NAME, SUBOBJECT_NAME, OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_OBJECTS
                            WHERE   OWNER = I_SCHEMA
                            AND     OBJECT_TYPE NOT IN ('TABLE','INDEX','TYPE','LOB','LOB PARTITION','SYNONYM','DATABASE LINK'))
                            UNION ALL
                            (SELECT OWNER, TABLE_NAME AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'TABLE' AS OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_TABLES A
                            WHERE   A.OWNER = I_SCHEMA
                            AND     NVL(A.IOT_TYPE, 'NULL') !=  'IOT_OVERFLOW'
                            AND     NOT EXISTS (SELECT NULL FROM DBA_MVIEW_LOGS B WHERE B.LOG_OWNER = A.OWNER AND B.LOG_TABLE = A.TABLE_NAME))
                            UNION ALL
                            (SELECT LOG_OWNER AS OWNER, LOG_TABLE AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'MATERIALIZED VIEW LOG' AS OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_MVIEW_LOGS 
                            WHERE   LOG_OWNER = I_SCHEMA)
                            UNION ALL
                            (SELECT OWNER, INDEX_NAME AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'INDEX' AS OBJECT_TYPE, INDEX_TYPE AS SUBOBJECT_TYPE
                            FROM    DBA_INDEXES A
                            WHERE   A.OWNER = I_SCHEMA
                            AND     INDEX_TYPE NOT IN ('LOB', 'IOT - TOP'))
                            UNION ALL
                            (SELECT OWNER, CONSTRAINT_NAME AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'CONSTRAINT' AS OBJECT_TYPE, CONSTRAINT_TYPE AS SUBOBJECT_TYPE
                            FROM    DBA_CONSTRAINTS A
                            WHERE   OWNER = I_SCHEMA)
                            UNION ALL
                            (SELECT OWNER, TYPE_NAME AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'TYPE' AS OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_TYPES A
                            WHERE   A.OWNER = I_SCHEMA)
                            UNION ALL
                            (SELECT OWNER, SYNONYM_NAME AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'SYNONYM' AS OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_SYNONYMS
                            WHERE   TABLE_OWNER = I_SCHEMA)
                            UNION ALL
                            (SELECT OWNER, DB_LINK AS OBJECT_NAME, NULL AS SUBOBJECT_NAME, 'DATABASE LINK' AS OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_DB_LINKS
                            WHERE   OWNER IN (I_SCHEMA, 'PUBLIC'))
                            UNION ALL
                            (SELECT OWNER, OBJECT_NAME, NULL AS SUBOBJECT_NAME, OBJECT_TYPE, NULL AS SUBOBJECT_TYPE
                            FROM    DBA_OBJECTS
                            WHERE   OWNER = 'SYS'
                            AND     OBJECT_TYPE = 'DIRECTORY')
                            ) ORDER BY OBJECT_TYPE, SUBOBJECT_TYPE, OBJECT_NAME)
    LOOP        
        
        L_ID := L_ID+1;
        L_REJECTED := 'N';
        L_MODIFIED := 'N';

        IF L_OBJECT_TYPE_PREV != T_ROW.OBJECT_TYPE AND L_OBJECT_TYPE_PREV != '#X#D#' AND L_OBJECT_CNT > 0
        THEN
            
            SAVE_SUMMARY(L_SUMMARY, L_OBJECT_TYPE_PREV, L_OBJECT_CNT, L_OBJECT_REJ_CNT, L_OBJECT_MOD_CNT);

            
            L_OBJECT_CNT := 1;
            L_OBJECT_REJ_CNT := 0;
            L_OBJECT_MOD_CNT := 0;
        ELSE
            L_OBJECT_CNT := L_OBJECT_CNT + 1;
        END IF;        
        
        IF I_ADB_TYPE IN ('ATP','ADW')
        THEN           
            
            IF T_ROW.OBJECT_TYPE = 'DATABASE LINK'
            THEN
                ADDTO_LIST(L_MOD8, L_ID, T_ROW.OBJECT_NAME);
                L_MODIFIED := 'Y';
            END IF;            
            
            IF T_ROW.OBJECT_TYPE = 'SYNONYM'
            THEN
                L_DATA_FOUND := 0;
                BEGIN
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_SYNONYMS B 
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.SYNONYM_NAME = T_ROW.OBJECT_NAME
                    AND     B.DB_LINK IS NOT NULL
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN
                    ADDTO_LIST(L_MOD9, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;    
        END IF;        
        
        IF I_ADB_TYPE IN ('ATP','ADW','ATPD')
        THEN
            
            
            IF T_ROW.OBJECT_TYPE LIKE 'JAVA%'
            THEN
                ADDTO_LIST(L_REJ4, L_ID, T_ROW.OBJECT_NAME);
                L_REJECTED := 'Y';
            END IF;            
            
            IF T_ROW.OBJECT_TYPE = 'DIRECTORY'
            THEN
                IF L_MAINTAINEDCOL_EXIST = 0
                THEN
                    IF T_ROW.OBJECT_NAME IN ('ORACLE_OCM_CONFIG_DIR','ORACLE_OCM_CONFIG_DIR2','XMLDIR','DATA_PUMP_DIR')
                    THEN
                        L_OBJECT_TYPE_PREV := T_ROW.OBJECT_TYPE;
                        L_OBJECT_CNT := L_OBJECT_CNT - 1;
                        CONTINUE;
                    ELSE
                        ADDTO_LIST(L_REJ8, L_ID, T_ROW.OBJECT_NAME);
                        L_REJECTED := 'Y';                
                    END IF;
                ELSE
                    L_DATA_FOUND := 0;

                    L_DATA_FOUND := GETCOUNT('SELECT COUNT(1) FROM DBA_OBJECTS WHERE owner = '''||T_ROW.OWNER||''' AND object_name = '''||T_ROW.OBJECT_NAME||''' AND object_type = ''DIRECTORY'' AND oracle_maintained = ''N''',NULL);

                    IF L_DATA_FOUND = 0 
                    THEN
                        L_OBJECT_TYPE_PREV := T_ROW.OBJECT_TYPE;
                        L_OBJECT_CNT := L_OBJECT_CNT - 1;
                        CONTINUE;
                    ELSE
                        ADDTO_LIST(L_REJ8, L_ID, T_ROW.OBJECT_NAME);
                        L_REJECTED := 'Y';                
                    END IF;
                END IF;
            END IF;

            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE' AND L_XMLTABCOLS_EXIST > 0
            THEN
                L_DATA_FOUND := 0;
                
                L_DATA_FOUND := GETCOUNT('SELECT COUNT(1) FROM DBA_XML_TAB_COLS WHERE OWNER = :1 AND TABLE_NAME = '''||T_ROW.OBJECT_NAME||''' AND (XMLSCHEMA IS NOT NULL OR STORAGE_TYPE != ''BINARY'')', I_SCHEMA);

                IF L_DATA_FOUND > 0
                THEN        
                    ADDTO_LIST(L_REJ6, L_ID, T_ROW.OBJECT_NAME);
                    L_REJECTED := 'Y';
                END IF;
            END IF;            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_COLS B 
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.DATA_TYPE IN ('SI_COLOR','SI_POSITIONALCOLOR','SI_AVERAGECOLOR','SI_TEXTURE',
                            'SI_COLORHISTOGRAM','SI_STILLIMAGE','SI_FEATURELIST','ORDDICOM','ORDDOC','ORDIMAGE','ORDVIDEO','ORDAUDIO')
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_REJ9, L_ID, T_ROW.OBJECT_NAME);
                    L_REJECTED := 'Y';
                END IF;
            END IF;
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_LOBS C
                    WHERE   C.OWNER = T_ROW.OWNER 
                    AND     C.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     C.SECUREFILE = 'NO'
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_MOD1, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;               
            

            
            IF T_ROW.OBJECT_TYPE = 'TABLE' AND T_ROW.SUBOBJECT_NAME IS NULL
            THEN
                L_DATA_FOUND := 0;

                IF L_INMEMORYCOL_EXIST = 1
                THEN
                    L_DATA_FOUND := GETCOUNT ('SELECT COUNT(1) FROM dba_tables b WHERE b.owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.inmemory = ''ENABLED''', NULL);
                END IF;

                IF L_DATA_FOUND >= 1
                THEN
                    L_MODIFIED := 'Y';
                END IF;
            END IF;
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE PARTITION'
            THEN
                L_DATA_FOUND := 0;

                IF L_INMEMORYCOL_EXIST = 1
                THEN
                    L_DATA_FOUND := GETCOUNT ('SELECT 1 FROM dba_tab_partitions b WHERE b.table_owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.partition_name = '''||T_ROW.SUBOBJECT_NAME||''' AND b.inmemory = ''ENABLED''', NULL);
                END IF;

                IF L_DATA_FOUND >= 1
                THEN
                    L_MODIFIED := 'Y';
                END IF;
            END IF;
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE SUBPARTITION'
            THEN
                L_DATA_FOUND := 0;

                IF L_INMEMORYCOL_EXIST = 1
                THEN
                    L_DATA_FOUND := GETCOUNT ('SELECT 1 FROM dba_tab_subpartitions b WHERE b.table_owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.subpartition_name = '''||T_ROW.SUBOBJECT_NAME||''' AND b.inmemory = ''ENABLED''', NULL);
                END IF;

                IF L_DATA_FOUND >= 1
                THEN
                    L_MODIFIED := 'Y';
                END IF;
            END IF; 

            
            IF T_ROW.OBJECT_TYPE = 'TABLE' AND L_INMEMORYCOL_EXIST = 1
            THEN                              
                OPEN L_CURS FOR 'SELECT b.table_name||'' (TABLE=1)'', 1 FROM dba_tables b WHERE b.owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.inmemory = ''ENABLED'' '|| 
                    'UNION ALL SELECT b.table_name||'' (PARTS=''||COUNT(1)||'')'', COUNT(1) FROM dba_tab_partitions b WHERE b.table_owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.inmemory = ''ENABLED'' GROUP BY b.table_name '||
                    'UNION ALL SELECT b.table_name||'' (SUBPARTS=''||COUNT(1)||'')'', COUNT(1) FROM dba_tab_subpartitions b WHERE b.table_owner = '''||T_ROW.OWNER||''' AND b.table_name = '''||T_ROW.OBJECT_NAME||''' AND b.inmemory = ''ENABLED'' GROUP BY b.table_name';
                LOOP
                    FETCH L_CURS INTO L_TEXT_FOUND, L_DATA_FOUND;
                    EXIT WHEN L_CURS%NOTFOUND;

                    L_INMEMORY_CNT := L_INMEMORY_CNT + L_DATA_FOUND;
                    ADDTO_LIST(L_MOD7, 1, L_TEXT_FOUND);
                END LOOP;
                CLOSE L_CURS;
            END IF;
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     T_ROW.SUBOBJECT_NAME IS NULL
                    AND     B.LOGGING = 'NO';
                    L_MODIFIED := 'Y';
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;
            END IF;
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE PARTITION'
            THEN
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_PARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.PARTITION_NAME = T_ROW.SUBOBJECT_NAME
                    AND     B.LOGGING = 'NO';
                    L_MODIFIED := 'Y';
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;
            END IF;
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE SUBPARTITION'
            THEN
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_SUBPARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.SUBPARTITION_NAME = T_ROW.SUBOBJECT_NAME
                    AND     B.LOGGING = 'NO';
                    L_MODIFIED := 'Y';
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;
            END IF;

            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                FOR B_ROW IN (            
                    SELECT  B.TABLE_NAME, 'TABLE' AS TYP, 1 AS CNT
                    FROM    DBA_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.LOGGING = 'NO'
                    UNION ALL
                    SELECT  B.TABLE_NAME, 'TABLE PARTITION' AS TYP, COUNT(1) AS CNT
                    FROM    DBA_TAB_PARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.LOGGING = 'NO'
                    GROUP BY B.TABLE_NAME, 'TABLE PARTITION'
                    UNION ALL
                    SELECT  B.TABLE_NAME, 'TABLE SUBPARTITION' AS TYP, COUNT(1) AS CNT
                    FROM    DBA_TAB_SUBPARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.LOGGING = 'NO'
                    GROUP BY B.TABLE_NAME, 'TABLE SUBPARTITION')
                LOOP
                    L_NOLOGGING_CNT := L_NOLOGGING_CNT + B_ROW.CNT;
                    ADDTO_LIST(L_MOD2, 1, B_ROW.TABLE_NAME||
                        (CASE (B_ROW.TYP) WHEN 'TABLE' THEN '(TABLE=1)' 
                                WHEN 'TABLE PARTITION' THEN '(PARTS='||B_ROW.CNT||')'
                                WHEN 'TABLE SUBPARTITION' THEN '(SUBPARTS='||B_ROW.CNT||')'
                                END));
                END LOOP; 
            END IF;

            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_EXTERNAL_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_MOD3, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;             

            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.IOT_TYPE = 'IOT'
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_MOD4, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;   

            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.CLUSTER_NAME IS NOT NULL;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_MOD5, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;   

            
            
            IF T_ROW.OBJECT_TYPE IN ('TABLE') AND L_ILMOBJECTS_EXIST > 0
            THEN
                L_DATA_FOUND := GETCOUNT('SELECT COUNT(1) FROM DBA_ILMOBJECTS b WHERE b.object_owner = '''||T_ROW.OWNER||''' AND b.object_name = '''||T_ROW.OBJECT_NAME||''' AND b.object_type = '''||T_ROW.OBJECT_TYPE||''' AND b.enabled = ''YES''',NULL);

                IF L_DATA_FOUND >= 1
                THEN        
                    ADDTO_LIST(L_MOD6, L_ID, T_ROW.OBJECT_NAME);
                    L_MODIFIED := 'Y';
                END IF;
            END IF;

        END IF;

        IF I_ADB_TYPE = 'ADW'
        THEN
            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_COLS B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.DATA_TYPE IN ('LONG','LONG RAW')
                    AND     (EXISTS (SELECT NULL FROM DBA_TABLES C
                            WHERE   C.OWNER = B.OWNER
                            AND     C.TABLE_NAME = B.TABLE_NAME
                            AND     (COMPRESS_FOR LIKE 'QUERY%' OR COMPRESS_FOR LIKE 'ARCHIVE%' OR COMPRESSION = 'DISABLED'))
                            OR     EXISTS (SELECT NULL FROM DBA_TAB_PARTITIONS C
                                    WHERE   C.TABLE_OWNER = B.OWNER
                                    AND     C.TABLE_NAME = B.TABLE_NAME
                                    AND     (COMPRESS_FOR LIKE 'QUERY%' OR COMPRESS_FOR LIKE 'ARCHIVE%' OR COMPRESSION = 'DISABLED'))
                            OR     EXISTS (SELECT NULL FROM DBA_TAB_SUBPARTITIONS C
                                    WHERE   C.TABLE_OWNER = B.OWNER
                                    AND     C.TABLE_NAME = B.TABLE_NAME
                                    AND     (COMPRESS_FOR LIKE 'QUERY%' OR COMPRESS_FOR LIKE 'ARCHIVE%' OR COMPRESSION = 'DISABLED')))
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_REJ11, L_ID, T_ROW.OBJECT_NAME);
                    L_REJECTED := 'Y';
                END IF;
            END IF;

            
            
            IF T_ROW.OBJECT_TYPE = 'TABLE'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TABLES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.COMPRESSION = 'DISABLED'
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_INFO1, L_ID, T_ROW.OBJECT_NAME);
                END IF;
            END IF;

            IF T_ROW.OBJECT_TYPE = 'TABLE PARTITION'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_PARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.PARTITION_NAME = T_ROW.SUBOBJECT_NAME
                    AND     B.COMPRESSION = 'DISABLED'
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_INFO1, L_ID, T_ROW.SUBOBJECT_NAME);
                END IF;
            END IF;  

            IF T_ROW.OBJECT_TYPE = 'TABLE SUBPARTITION'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_TAB_SUBPARTITIONS B
                    WHERE   B.TABLE_OWNER = T_ROW.OWNER 
                    AND     B.TABLE_NAME = T_ROW.OBJECT_NAME
                    AND     B.SUBPARTITION_NAME = T_ROW.SUBOBJECT_NAME
                    AND     B.COMPRESSION = 'DISABLED'
                    AND     ROWNUM <= 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_INFO1, L_ID, T_ROW.SUBOBJECT_NAME);
                END IF;
            END IF;
        END IF;

        IF I_ADB_TYPE IN ('ATP', 'ATPD')
        THEN
            IF T_ROW.OBJECT_TYPE = 'INDEX'
            THEN
                L_DATA_FOUND := 0;
                BEGIN            
                    SELECT  1 INTO L_DATA_FOUND
                    FROM    DBA_INDEXES B
                    WHERE   B.OWNER = T_ROW.OWNER 
                    AND     B.INDEX_NAME = T_ROW.OBJECT_NAME
                    AND     B.DEGREE > 1;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN NULL;
                END;

                IF L_DATA_FOUND = 1
                THEN        
                    ADDTO_LIST(L_INFO2, L_ID, T_ROW.OBJECT_NAME);
                END IF;
            END IF;
        END IF;

        IF L_REJECTED = 'Y' THEN L_OBJECT_REJ_CNT := L_OBJECT_REJ_CNT + 1; END IF;
        IF L_MODIFIED = 'Y' THEN L_OBJECT_MOD_CNT := L_OBJECT_MOD_CNT + 1; END IF;
        L_OBJECT_TYPE_PREV := T_ROW.OBJECT_TYPE;

        
        
        SAVE_DETAIL(L_DETAIL, L_ID, L_ADB_TYPE, T_ROW.OWNER, T_ROW.OBJECT_NAME, T_ROW.SUBOBJECT_NAME, T_ROW.OBJECT_TYPE, T_ROW.SUBOBJECT_TYPE, L_REJECTED, L_MODIFIED);

    END LOOP;    

    
    
    IF L_OBJECT_CNT > 0 
    THEN
        SAVE_SUMMARY(L_SUMMARY, L_OBJECT_TYPE_PREV, L_OBJECT_CNT, L_OBJECT_REJ_CNT, L_OBJECT_MOD_CNT);
    END IF;
    IF (L_XMLTABLES_EXIST > 0)
    THEN
        L_XMLTABLES_CNT := GETCOUNT('SELECT COUNT(1) FROM DBA_XML_TABLES WHERE OWNER = :1', I_SCHEMA);
        L_XMLTABLES_REJ_CNT := GETCOUNT('SELECT COUNT(1) FROM DBA_XML_TABLES WHERE OWNER = :1 AND (XMLSCHEMA IS NOT NULL OR STORAGE_TYPE != ''BINARY'')', I_SCHEMA);
        
        IF (L_XMLTABLES_CNT > 0)
        THEN
            SAVE_SUMMARY(L_SUMMARY, 'XMLTYPE TABLE', L_XMLTABLES_CNT, L_XMLTABLES_REJ_CNT, 0);
        END IF;
        
        IF (L_XMLTABLES_REJ_CNT > 0)
        THEN
            OPEN L_CURS FOR 'SELECT TABLE_NAME FROM DBA_XML_TABLES WHERE OWNER = '''||I_SCHEMA||''' AND (XMLSCHEMA IS NOT NULL OR STORAGE_TYPE != ''BINARY'')';
            LOOP
                FETCH L_CURS INTO L_TEXT_FOUND;
                EXIT WHEN L_CURS%NOTFOUND;

                ADDTO_LIST(L_REJ5, 1, L_TEXT_FOUND);
            END LOOP;
            CLOSE L_CURS;
        END IF;
    END IF;
    
    IF (L_XMLSCHEMAS_EXIST > 0)
    THEN
        L_XMLSCHEMAS_CNT := GETCOUNT('SELECT COUNT(1) FROM DBA_XML_SCHEMAS WHERE OWNER = :1', I_SCHEMA);
        L_XMLSCHEMAS_REJ_CNT := L_XMLSCHEMAS_CNT;
        
        IF (L_XMLSCHEMAS_CNT > 0)
        THEN
            SAVE_SUMMARY(L_SUMMARY, 'XMLSCHEMA', L_XMLSCHEMAS_CNT, L_XMLSCHEMAS_CNT, 0);
        END IF;
        
        IF (L_XMLSCHEMAS_CNT > 0)
        THEN
            OPEN L_CURS FOR 'SELECT SCHEMA_URL FROM DBA_XML_SCHEMAS WHERE OWNER = '''||I_SCHEMA||'''';
            LOOP
                FETCH L_CURS INTO L_TEXT_FOUND;
                EXIT WHEN L_CURS%NOTFOUND;

                ADDTO_LIST(L_REJ7, 1, L_TEXT_FOUND);
            END LOOP;
            CLOSE L_CURS;
        END IF;
    END IF;

    
    
    IF I_ADB_TYPE IN ('ADW','ATP')
    THEN
        FOR T_ROW IN (SELECT ROWNUM, TABLESPACE_NAME FROM (
                SELECT TABLESPACE_NAME 
                FROM DBA_SEGMENTS 
                WHERE OWNER = I_SCHEMA 
                GROUP BY TABLESPACE_NAME))
        LOOP
            ADDTO_LIST(L_INFO3, T_ROW.ROWNUM, T_ROW.TABLESPACE_NAME);
        END LOOP;
    END IF;
    
    L_TEXT_FOUND := NULL;
    BEGIN            
        SELECT  VALUE INTO L_TEXT_FOUND
        FROM    NLS_DATABASE_PARAMETERS
        WHERE   PARAMETER = 'NLS_CHARACTERSET'
        AND     VALUE NOT IN ('AL16UTF16','AL32UTF8','UTF8','UTFE')
        AND     VALUE NOT LIKE 'Z%' 
        AND     VALUE NOT LIKE 'K%'
        AND     VALUE NOT LIKE 'J%';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN NULL;
    END;

    IF L_TEXT_FOUND IS NOT NULL
    THEN        
        ADDTO_LIST(L_INFO4, 1, L_TEXT_FOUND);
    END IF;
    
    FOR T_ROW IN (SELECT TABLE_NAME, COUNT(1) AS CNT
        FROM DBA_TAB_COLS WHERE OWNER = I_SCHEMA AND CHAR_USED = 'B' GROUP BY TABLE_NAME)
    LOOP
        L_COLBYTE_CNT := L_COLBYTE_CNT + T_ROW.CNT;
        ADDTO_LIST(L_INFO5, 1, T_ROW.TABLE_NAME||' (COLS='||T_ROW.CNT||')');
    END LOOP;
    
    IF I_ADB_TYPE IN ('ADW','ATP')
    THEN
        L_TEXT_FOUND := NULL;
        BEGIN
            SELECT 'DEFAULT TABLESPACE Modified: Current: '''||DEFAULT_TABLESPACE||''', New: ''DATA'''
            INTO    L_TEXT_FOUND
            FROM    DBA_USERS
            WHERE   USERNAME = I_SCHEMA
            AND     DEFAULT_TABLESPACE != 'DATA'
            AND     ROWNUM <=1;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN NULL;
        END;

        IF L_TEXT_FOUND IS NOT NULL
        THEN
            ADDTO_LIST(L_INFO6, 1, L_TEXT_FOUND);
        END IF;
    END IF;
    
    IF I_ADB_TYPE IN ('ADW','ATP', 'ATPD')
    THEN
        L_TEXT_FOUND := NULL;
        BEGIN
            SELECT 'PROFILE Modified: Current: '''||PROFILE||''', New: ''DEFAULT'''
            INTO    L_TEXT_FOUND
            FROM    DBA_USERS
            WHERE   USERNAME = I_SCHEMA
            AND     PROFILE != 'DEFAULT'
            AND     ROWNUM <=1;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN NULL;
        END;

        IF L_TEXT_FOUND IS NOT NULL
        THEN
            ADDTO_LIST(L_INFO6, 1, L_TEXT_FOUND);
        END IF;
    END IF;

    
    
    IF I_ADB_TYPE IN ('ADW','ATP','ATPD')
    THEN
        FOR T_ROW IN (SELECT ROWNUM, PROFILE FROM (SELECT PROFILE FROM DBA_PROFILES WHERE PROFILE NOT IN ('DEFAULT','ORA_STIG_PROFILE') GROUP BY PROFILE))
        LOOP
        L_TEXT_FOUND := NULL;
            ADDTO_LIST(L_INFO7, T_ROW.ROWNUM, T_ROW.PROFILE);
        END LOOP;
    END IF;

    
    
    IF I_ADB_TYPE IN ('ADW')
    THEN
        FOR T_ROW IN (SELECT ROWNUM, A.PROFILE, A.RESOURCE_NAME, A.RESOURCE_TYPE, A.LIMIT, B.PROFILE ADW_PROFILE, B.RESOURCE_NAME ADW_RESOURCE_NAME, B.RESOURCE_TYPE ADW_RESOURCE_TYPE, B.LIMIT ADW_LIMIT
                    FROM (SELECT * FROM DBA_PROFILES WHERE PROFILE = 'DEFAULT') A 
                    FULL OUTER JOIN
                    (SELECT 'DEFAULT' AS PROFILE,'COMPOSITE_LIMIT' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CONNECT_TIME' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CPU_PER_CALL' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CPU_PER_SESSION' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'FAILED_LOGIN_ATTEMPTS' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'10' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'IDLE_TIME' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'INACTIVE_ACCOUNT_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'LOGICAL_READS_PER_CALL' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'LOGICAL_READS_PER_SESSION' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_GRACE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'7' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_LIFE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'360' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_LOCK_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'1' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_REUSE_MAX' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'4' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_REUSE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'1' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_VERIFY_FUNCTION' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'CLOUD_VERIFY_FUNCTION' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PRIVATE_SGA' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'SESSIONS_PER_USER' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL) B
                    ON (B.PROFILE = A.PROFILE
                    AND B.RESOURCE_NAME = A.RESOURCE_NAME
                    AND B.RESOURCE_TYPE = A.RESOURCE_TYPE)
                    WHERE NVL(A.LIMIT,'#') != NVL(B.LIMIT,'$')
                    ORDER BY A.PROFILE, A.RESOURCE_NAME, A.RESOURCE_TYPE)
        LOOP
           ADDTO_LIST(L_INFO8, T_ROW.ROWNUM, RPAD(NVL(SUBSTR(T_ROW.RESOURCE_NAME,1,30), SUBSTR(T_ROW.ADW_RESOURCE_NAME,1,30)),34, ' ')||RPAD(NVL(SUBSTR(TO_CHAR(T_ROW.LIMIT),1,30), '<NULL>'), 34, ' ')||RPAD(NVL(SUBSTR(TO_CHAR(T_ROW.ADW_LIMIT),1,30), '<NULL>'), 34, ' '));
        END LOOP;
    END IF;
    
    IF I_ADB_TYPE IN ('ATP', 'ATPD')
    THEN
        FOR T_ROW IN (SELECT ROWNUM, A.PROFILE, A.RESOURCE_NAME, A.RESOURCE_TYPE, A.LIMIT, B.PROFILE ADW_PROFILE, B.RESOURCE_NAME ADW_RESOURCE_NAME, B.RESOURCE_TYPE ADW_RESOURCE_TYPE, B.LIMIT ADW_LIMIT
                    FROM (SELECT * FROM DBA_PROFILES WHERE PROFILE = 'DEFAULT') A 
                    FULL OUTER JOIN
                    (SELECT 'DEFAULT' AS PROFILE,'COMPOSITE_LIMIT' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CONNECT_TIME' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CPU_PER_CALL' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'CPU_PER_SESSION' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'FAILED_LOGIN_ATTEMPTS' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'10' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'IDLE_TIME' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'INACTIVE_ACCOUNT_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'LOGICAL_READS_PER_CALL' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'LOGICAL_READS_PER_SESSION' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_GRACE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'7' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_LIFE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'360' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_LOCK_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'1' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_REUSE_MAX' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'4' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_REUSE_TIME' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'1' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PASSWORD_VERIFY_FUNCTION' AS RESOURCE_NAME,'PASSWORD' AS RESOURCE_TYPE,'CLOUD_VERIFY_FUNCTION' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'PRIVATE_SGA' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL
                    UNION
                    SELECT 'DEFAULT' AS PROFILE,'SESSIONS_PER_USER' AS RESOURCE_NAME,'KERNEL' AS RESOURCE_TYPE,'UNLIMITED' AS LIMIT FROM DUAL) B
                    ON (B.PROFILE = A.PROFILE
                    AND B.RESOURCE_NAME = A.RESOURCE_NAME
                    AND B.RESOURCE_TYPE = A.RESOURCE_TYPE)
                    WHERE NVL(A.LIMIT,'#') != NVL(B.LIMIT,'$')
                    ORDER BY A.PROFILE, A.RESOURCE_NAME, A.RESOURCE_TYPE)
        LOOP
           ADDTO_LIST(L_INFO8, T_ROW.ROWNUM, RPAD(NVL(SUBSTR(T_ROW.RESOURCE_NAME,1,30), SUBSTR(T_ROW.ADW_RESOURCE_NAME,1,30)),34, ' ')||RPAD(NVL(SUBSTR(TO_CHAR(T_ROW.LIMIT),1,30), '<NULL>'), 34, ' ')||RPAD(NVL(SUBSTR(TO_CHAR(T_ROW.ADW_LIMIT),1,30), '<NULL>'), 34, ' '));
        END LOOP;
    END IF;

    IF I_ADB_TYPE IN ('ATP','ADW','ATPD')
    THEN
        FOR T_ROW IN (SELECT DISTINCT OPTIONS FROM (
                    SELECT  NAME, (CASE NAME 
                            WHEN 'Automatic Maintenance - SQL Tuning Advisor'   THEN 'Tuning Pack'
                            WHEN 'Automatic SQL Tuning Advisor'                 THEN 'Tuning Pack'
                            WHEN 'Real-Time SQL Monitoring'                     THEN 'Tuning Pack'
                            WHEN 'SQL Access Advisor'                           THEN 'Tuning Pack'
                            WHEN 'SQL Monitoring and Tuning pages'              THEN 'Tuning Pack'
                            WHEN 'SQL Profile'                                  THEN 'Tuning Pack'
                            WHEN 'SQL Tuning Advisor'                           THEN 'Tuning Pack'
                            WHEN 'SQL Tuning Set (user)'                        THEN 'Tuning Pack'
                            WHEN 'Tuning Pack'                                  THEN 'Tuning Pack'
                            WHEN 'ADDM'                                         THEN 'Diagnostics Pack'
                            WHEN 'AWR Baseline'                                 THEN 'Diagnostics Pack'
                            WHEN 'AWR Baseline Template'                        THEN 'Diagnostics Pack'
                            WHEN 'AWR Report'                                   THEN 'Diagnostics Pack'
                            WHEN 'Automatic Workload Repository'                THEN 'Diagnostics Pack'
                            WHEN 'Baseline Adaptive Thresholds'                 THEN 'Diagnostics Pack'
                            WHEN 'Baseline Static Computations'                 THEN 'Diagnostics Pack'
                            WHEN 'Diagnostic Pack'                              THEN 'Diagnostics Pack'
                            WHEN 'EM Performance Page'                          THEN 'Diagnostics Pack' 
                            WHEN 'OLAP - Cubes'                                 THEN 'OLAP'
                            WHEN 'OLAP - Analytic Workspaces'                   THEN 'OLAP'
                            WHEN 'Change Management Pack'                       THEN 'Change Management Pack'
                            WHEN 'EM Config Management Pack'                    THEN 'Configuration Management Pack for Oracle Database'
                            WHEN 'Data Masking Pack'                            THEN 'Data Masking Pack'
                            WHEN 'Database Replay: Workload Capture'            THEN 'Real Application Testing'
                            WHEN 'Database Replay: Workload Replay'             THEN 'Real Application Testing'
                            WHEN 'Oracle Multimedia'                            THEN 'Oracle Multimedia'
                            WHEN 'Oracle Multimedia DICOM'                      THEN 'Oracle Multimedia'
                            WHEN 'Oracle Java Virtual Machine (user)'           THEN 'Java in DB'
                            WHEN 'Oracle Java Virtual Machine (system)'         THEN 'Java in DB'
                            ELSE NAME END) AS OPTIONS
                    FROM    DBA_FEATURE_USAGE_STATISTICS
                    WHERE   NAME IN ('Automatic Maintenance - SQL Tuning Advisor','Automatic SQL Tuning Advisor',
                            'Real-Time SQL Monitoring','SQL Access Advisor','SQL Monitoring and Tuning pages',
                            'SQL Profile','SQL Tuning Advisor','SQL Tuning Set (user)','Tuning Pack',
                            'EM Performance Page','Diagnostic Pack','Baseline Static Computations','Baseline Adaptive Thresholds',
                            'Automatic Workload Repository','AWR Report','AWR Baseline Template','AWR Baseline','ADDM',
                            'Change Management Pack','EM Config Management Pack','Data Masking Pack','OLAP - Analytic Workspaces',
                            'OLAP - Cubes','Database Replay: Workload Replay','Database Replay: Workload Capture',
                            'Oracle Database Vault','Semantics/RDF','Workspace Manager',
                            'Oracle Multimedia','Oracle Multimedia DICOM','Oracle Java Virtual Machine (user)',
                            'Oracle Java Virtual Machine (system)')
                    AND     DETECTED_USAGES > 0)
            ORDER BY OPTIONS)
        LOOP
           ADDTO_LIST(L_INFO9, 1, T_ROW.OPTIONS);
        END LOOP;
    END IF;

    
    
    
    IF I_ADB_TYPE IN ('ADW', 'ATP','ATPD')
    THEN
        FOR T_ROW IN (SELECT NAME FROM V\$PARAMETER
            WHERE (ISDEFAULT = 'FALSE' OR ISMODIFIED != 'FALSE') AND ISBASIC = 'FALSE'
            AND LOWER(NAME) NOT IN ('sga_max_size','db_block_size','instance_number','remote_login_passwordfile',
            'parallel_min_server','parallel_max_server','result_cache_max_size','result_cache_max_result','pga_aggregate_target',
            'diagnostic_dest','db_unique_name','db_name','audit_file_dest','audit_trail','parallel_execution_message_size',
            'listener_networks','remote_listener','dispatchers','global_names','db_domain','undo_tablespace','db_recovery_file_dest_size',
            'db_recovery_file_dest','db_create_online_log_dest_1',
            'db_create_file_dest','db_files','log_archive_format','log_buffer','control_files','sga_target',
            '_file_size_increase_increment','pga_aggregate_limit','cpu_count','_enable_NUMA_support')
            AND LOWER(NAME) NOT IN ('approx_for_aggregation','approx_for_count_distinct','approx_for_percentile','awr_pdb_autoflush_enabled',
            'container','current_schema','edition','nls_calendar','nls_comp','nls_currency','nls_date_format','nls_date_language',
            'nls_dual_currency','nls_iso_currency','nls_nchar_conv_excp','nls_language','nls_length_semantics','nls_numeric_characters',
            'nls_sort','nls_territory','nls_timestamp_format','nls_timestamp_tz_format','nls_time_format','nls_time_tz_format',
            'optimizer_capture_sql_plan_baselines','optimizer_ignore_hints','optimizer_ignore_parallel_hints','plsql_optimize_level',
            'plsql_warnings','default_collation','plscope_settings','plsql_ccflags','plsql_debug','time_zone',
            'isolation_level','statistics_level','approx_for_aggregation','approx_for_count_distinct','approx_for_percentile',
            'awr_pdb_autoflush_enabled','nls_calendar','nls_currency','nls_date_format','nls_date_language','nls_iso_currency','nls_language',
            'nls_numeric_characters','nls_sort','nls_territory','nls_timestamp_format','nls_time_format','nls_time_tz_format',
            'nls_comp','nls_dual_currency','nls_length_semantics','nls_nchar_conv_excp','nls_timestamp_tz_format','optimizer_ignore_hints',
            'optimizer_ignore_parallel_hints','plscope_settings','plsql_ccflags','plsql_debug','plsql_optimize_level','plsql_warnings','fixed_date')
            ORDER BY NAME)
        LOOP
            ADDTO_LIST(L_INFO10, 1, T_ROW.NAME);
        END LOOP;
    END IF;

    
    
    
/*    DBMS_OUTPUT.PUT_LINE('==========================================================================================');
    DBMS_OUTPUT.PUT_LINE('== '||I_ADB_TYPE||' SCHEMA MIGRATION REPORT FOR '||I_SCHEMA);
    DBMS_OUTPUT.PUT_LINE('==========================================================================================');
    DBMS_OUTPUT.NEW_LINE();
*/

    IF (L_DETAIL.COUNT = 0)
    THEN
		DBMS_OUTPUT.PUT_LINE('Heading U_I_GG ${schema_name_part} : 1. SCHEMA ADVISOR SUMMARY REPORT FOR ${workload_type}');
	    DBMS_OUTPUT.PUT_LINE('<p><table border=''1'' width=''90%'' align=''center'' summary=''Script output''>');
		DBMS_OUTPUT.PUT_LINE('<tr> <th scope="col">OBSERVATIONS</th></tr>');
		DBMS_OUTPUT.PUT_LINE('<tr><td>'); 
        DBMS_OUTPUT.PUT_LINE('-- No eligible objects found for migration in Schema '''||I_SCHEMA||'''');
		DBMS_OUTPUT.PUT_LINE('</td></tr>');
		DBMS_OUTPUT.PUT_LINE ('</table>');
        RETURN;
    END IF;
/*
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('-- '||I_ADB_TYPE||' MIGRATION SUMMARY');
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.NEW_LINE();
    DBMS_OUTPUT.PUT_LINE(RPAD(' ', 25, ' ')||'  '||RPAD(' ', 14, ' ')||'  '||RPAD(' ', 14, ' ')||'  '||RPAD('Objects', 14, ' ')||'  '||RPAD('Total', 14, ' '));
    DBMS_OUTPUT.PUT_LINE(RPAD(' ', 25, ' ')||'  '||RPAD('Object', 14, ' ')||'  '||RPAD('Objects', 14, ' ')||'  '||RPAD('Migrated', 14, ' ')||'  '||RPAD('Objects', 14, ' '));
    DBMS_OUTPUT.PUT_LINE(RPAD('Object Type', 25, ' ')||'  '||RPAD('Count', 14, ' ')||'  '||RPAD('Not Migrated', 14, ' ')||'  '||RPAD('With Changes', 14, ' ')||'  '||RPAD('Migrated', 14, ' '));
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 25, '-')||'  '||RPAD('-', 14, '-')||'  '||RPAD('-', 14, '-')||'  '||RPAD('-', 14, '-')||'  '||RPAD('-', 14, '-'));
*/
	
	DBMS_OUTPUT.PUT_LINE('Heading U_I_GG ${schema_name_part} : 1. MIGRATION SUMMARY FOR ${workload_type}');
	DBMS_OUTPUT.PUT_LINE('<p><table border=''1'' width=''90%'' align=''center'' summary=''Script output''>');
	DBMS_OUTPUT.PUT_LINE('<tr> <th scope="col">OBJECT TYPE</th><th scope="col">OBJECT COUNT</th><th scope="col">OBJECTS NOT ELIGIBLE</th><th scope="col">OBJECTS ELIGIBLE WITH CHANGES</th><th scope="col">TOTAL ELIGIBLE OBJECTS</th></tr>');

    FOR I IN 1..L_SUMMARY.COUNT
    LOOP
    --  DBMS_OUTPUT.PUT_LINE(RPAD(L_SUMMARY(I).OBJECT_TYPE, 25, ' ')||'  '||RPAD(L_SUMMARY(I).OBJECT_CNT, 14, ' ')||'  '||RPAD(L_SUMMARY(I).REJECT_CNT, 14, ' ')||'  '||RPAD(L_SUMMARY(I).MODIFIED_CNT, 14, ' ')||'  '||RPAD(L_SUMMARY(I).OBJECT_CNT-L_SUMMARY(I).REJECT_CNT, 14, ' '));
        DBMS_OUTPUT.PUT_LINE ('<tr><td>'||L_SUMMARY(I).OBJECT_TYPE||'</td><td  align="center" class=''datatabb''>'||TO_CHAR(L_SUMMARY(I).OBJECT_CNT)||'</td><td  align="center"  class=''datatabr''>'||TO_CHAR(L_SUMMARY(I).REJECT_CNT)||'</td><td  align="center"  class=''datatabb''>'||TO_CHAR(L_SUMMARY(I).MODIFIED_CNT)||'</td><td  align="center"  class=''datatabg''>'||TO_CHAR(L_SUMMARY(I).OBJECT_CNT-L_SUMMARY(I).REJECT_CNT)||'</td></tr>');
	END LOOP;

/*    DBMS_OUTPUT.NEW_LINE();
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('-- '||I_ADB_TYPE||' OBJECTS NOT MIGRATED');
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.NEW_LINE();
*/
	DBMS_OUTPUT.PUT_LINE ('</table>');
	DBMS_OUTPUT.PUT_LINE('Heading U_I_GG ${schema_name_part} : 2. OBJECTS NOT ELIGIBLE FOR ${workload_type}');
    DBMS_OUTPUT.PUT_LINE('<p><table border=''1'' width=''90%'' align=''center'' summary=''Script output''>');
	DBMS_OUTPUT.PUT_LINE('<tr> <th scope="col">OBSERVATIONS</th></tr>');

    L_ID := 0;


    IF L_REJ4.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ4, L_ID||'. '||L_REJ4_SHORT_DESC, L_REJ4_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_REJ5.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ5, L_ID||'. '||L_REJ5_SHORT_DESC, L_REJ5_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_REJ6.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ6, L_ID||'. '||L_REJ6_SHORT_DESC, L_REJ6_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_REJ7.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ7, L_ID||'. '||L_REJ7_SHORT_DESC, L_REJ7_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_REJ8.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ8, L_ID||'. '||L_REJ8_SHORT_DESC, L_REJ8_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_REJ9.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ9, L_ID||'. '||L_REJ9_SHORT_DESC, L_REJ9_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
	
    IF L_REJ11.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_REJ11, L_ID||'. '||L_REJ11_SHORT_DESC, L_REJ11_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
	
/*    DBMS_OUTPUT.NEW_LINE();
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('-- '||I_ADB_TYPE||' OBJECTS MIGRATED WITH CHANGES');
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.NEW_LINE();
*/
	DBMS_OUTPUT.PUT_LINE ('</table>');
	DBMS_OUTPUT.PUT_LINE('Heading U_I_GG ${schema_name_part} : 3. OBJECTS ELIGIBLE WITH CHANGES FOR ${workload_type}');
    DBMS_OUTPUT.PUT_LINE('<p><table border=''1'' width=''90%'' align=''center'' summary=''Script output''>');
	DBMS_OUTPUT.PUT_LINE('<tr> <th scope="col">OBSERVATIONS</th></tr>');

    L_ID := 0;
    IF L_MOD1.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD1, L_ID||'. '||L_MOD1_SHORT_DESC, L_MOD1_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD2.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD2, L_ID||'. '||L_MOD2_SHORT_DESC, L_MOD2_LONG_DESC, I_COUNT => L_NOLOGGING_CNT); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD3.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD3, L_ID||'. '||L_MOD3_SHORT_DESC, L_MOD3_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD4.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD4, L_ID||'. '||L_MOD4_SHORT_DESC, L_MOD4_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD5.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD5, L_ID||'. '||L_MOD5_SHORT_DESC, L_MOD5_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD6.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD6, L_ID||'. '||L_MOD6_SHORT_DESC, L_MOD6_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD7.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD7, L_ID||'. '||L_MOD7_SHORT_DESC, L_MOD7_LONG_DESC, I_COUNT => L_INMEMORY_CNT); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD8.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD8, L_ID||'. '||L_MOD8_SHORT_DESC, L_MOD8_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_MOD9.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>');  PRINTARRAY(L_MOD9, L_ID||'. '||L_MOD9_SHORT_DESC, L_MOD9_LONG_DESC); DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;

/*    DBMS_OUTPUT.NEW_LINE();
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('-- '||I_ADB_TYPE||' MIGRATION ADDITIONAL INFO');
    DBMS_OUTPUT.PUT_LINE('------------------------------------------------------------------------------------------');
    DBMS_OUTPUT.NEW_LINE();
*/

	DBMS_OUTPUT.PUT_LINE ('</table>');
	DBMS_OUTPUT.PUT_LINE('Heading U_I_GG ${schema_name_part} : 4. ADDITIONAL MIGRATION INFO FOR ${workload_type}');
    DBMS_OUTPUT.PUT_LINE('<p><table border=''1'' width=''90%'' align=''center'' summary=''Script output''>');
	DBMS_OUTPUT.PUT_LINE('<tr> <th scope="col">OBSERVATIONS</th></tr>');

    L_ID := 0;
    IF L_INFO1.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO1, L_ID||'. '||L_INFO1_SHORT_DESC, L_INFO1_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO2.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO2, L_ID||'. '||L_INFO2_SHORT_DESC, L_INFO2_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO3.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO3, L_ID||'. '||L_INFO3_SHORT_DESC, L_INFO3_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO4.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO4, L_ID||'. '||L_INFO4_SHORT_DESC, L_INFO4_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO5.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO5, L_ID||'. '||L_INFO5_SHORT_DESC, L_INFO5_LONG_DESC, I_COUNT => L_COLBYTE_CNT);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO6.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO6, L_ID||'. '||L_INFO6_SHORT_DESC, L_INFO6_LONG_DESC, 'Y');DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO7.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO7, L_ID||'. '||L_INFO7_SHORT_DESC, L_INFO7_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO8.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY_WITHEAD(L_INFO8, L_ID||'. '||L_INFO8_SHORT_DESC, L_INFO8_LONG_DESC, RPAD('RESOURCE', 34, ' ')||RPAD('CURRENT LIMITS IN DB', 34, ' ')||RPAD('NEW LIMITS IN ADW/ATP', 34, ' '),RPAD('-',30,'-')||'    '||RPAD('-',30,'-')||'    '||RPAD('-',30,'-'));DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO9.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO9, L_ID||'. '||L_INFO9_SHORT_DESC, L_INFO9_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
    IF L_INFO10.COUNT > 0 THEN L_ID:=L_ID+1; DBMS_OUTPUT.PUT_LINE('<tr><td>'); PRINTARRAY(L_INFO10, L_ID||'. '||L_INFO10_SHORT_DESC, L_INFO10_LONG_DESC);DBMS_OUTPUT.PUT_LINE('</td></tr>'); END IF;
	DBMS_OUTPUT.PUT_LINE ('</table>');

END REPORT;

BEGIN
REPORT('${schema_name_part}','${workload_type}');
END;
/
spool off;
SET MARKUP HTML OFF;
SET TERMOUT ON;
exit;
EOF
done < <(echo $schema_name | awk -F, '{ for (i = 1; i <= NF; ++i ) print $i }')
if [ $? = 0 ]; then
echo 'Script Executed Successfully!!!'
else
echo 'Script Executed with errors!!!'
fi
