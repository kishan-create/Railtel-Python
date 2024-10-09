DROP SCHEMA IF EXISTS `omf_db`;
CREATE SCHEMA `omf_db`;
USE `omf_db`;

CREATE TABLE IF NOT EXISTS `country` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(250) NOT NULL,
    phone_country_code VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `user_info` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    phone_code VARCHAR(50) NOT NULL,
    phone_code_verified BOOLEAN DEFAULT FALSE,
    email_id VARCHAR(250) NOT NULL,
    email_code VARCHAR(250) NOT NULL,
    email_code_verified BOOLEAN DEFAULT FALSE,
    password VARCHAR(50) NOT NULL,
    country_id INT NOT NULL,
    created_by VARCHAR(50) NULL,
    created_date INT NULL,
    updated_by VARCHAR(50) NULL,
    update_date	INT NULL,
    status SMALLINT DEFAULT 1,
    CONSTRAINT chk_user_info_status CHECK (status IN (1, 2, 3, 4)),
    CONSTRAINT uq_user_info_email_id UNIQUE (email_id),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE IF NOT EXISTS `activity_log` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	activity TEXT NOT NULL,
	table_id INT NULL,
	table_name VARCHAR(50) NULL,
	logged_by INT NULL,
	log_date INT NULL
);

CREATE TABLE IF NOT EXISTS `error_log` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	table_id INT NULL,
	table_name VARCHAR(50) NULL,
	error_message TEXT NULL,
	source TEXT NULL,
	logged_by INT NULL,
	log_date INT NULL,
    FOREIGN KEY (logged_by) REFERENCES user_info(id)
);

CREATE TABLE IF NOT EXISTS `database_assessment` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(250) NOT NULL,
	server_name VARCHAR(250) NOT NULL,
	user_id VARCHAR(250) NOT NULL,
	port VARCHAR(50) NOT NULL,
	connection_url VARCHAR(250) NOT NULL,
	password VARCHAR(50) NOT NULL,
	created_by INT NULL UNIQUE,
	created_date INT NULL,
	updated_by INT NULL,
	update_date INT NULL,
	status SMALLINT DEFAULT 1,
	CONSTRAINT chk_database_assessment_status CHECK (status IN (1, 2, 3)),
	FOREIGN KEY (created_by) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (updated_by) REFERENCES user_info(id)
);

CREATE TABLE IF NOT EXISTS `data_warehouse_assessment` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_name VARCHAR(250) NOT NULL,
	server_name VARCHAR(250) NOT NULL,
	user_id VARCHAR(250) NOT NULL,
	port VARCHAR(50) NOT NULL,
	connection_url VARCHAR(250) NOT NULL,
	password VARCHAR(50) NOT NULL,
	created_by INT NULL UNIQUE,
	created_date INT NULL,
	updated_by INT NULL,
	update_date INT NULL,
	status SMALLINT DEFAULT 1,
	CONSTRAINT chk_data_warehouse_assessment_status CHECK (status IN (1, 2, 3)),
	FOREIGN KEY (created_by) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (updated_by) REFERENCES user_info(id)
);

CREATE TABLE IF NOT EXISTS `oci_administration` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	oci_endpoint VARCHAR(250) NOT NULL,
	tenancy_id VARCHAR(250) NOT NULL,
	user_ocid VARCHAR(250) NOT NULL,
	private_key TEXT NOT NULL,
	oci_region VARCHAR(250) NOT NULL,
	fingure_print VARCHAR(250) NOT NULL,
	created_by INT NULL UNIQUE,
	created_date INT NULL,
	updated_by INT NULL,
	update_date INT NULL,
	status SMALLINT DEFAULT 1,
	CONSTRAINT chk_oci_administration_status CHECK (status IN (1, 2, 3)),
	FOREIGN KEY (created_by) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (updated_by) REFERENCES user_info(id)
);

CREATE TABLE IF NOT EXISTS `oci_configuration` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	availability_domain VARCHAR(250) NOT NULL,
	backup_policy VARCHAR(250) NOT NULL,
	boot_volume_size VARCHAR(250) NOT NULL,
	preserve_boot_volume VARCHAR(250) NOT NULL,
	compartment_name VARCHAR(250) NOT NULL,
	load_balancer_timeout VARCHAR(250) NOT NULL,
	client_prefix VARCHAR(250) NOT NULL,
	vcn_cidr VARCHAR(250) NOT NULL,
	vcn_sub_cidr VARCHAR(250) NOT NULL,
	mgmt_sub_cidr VARCHAR(250) NOT NULL,
	ssh_pub_key_1 VARCHAR(250) NOT NULL,
	ssh_pub_key_2 VARCHAR(250) NOT NULL,
	db_system_size VARCHAR(250) NOT NULL,
	db_system_count VARCHAR(250) NOT NULL,
	db_edition VARCHAR(250) NOT NULL,
	db_version VARCHAR(250) NOT NULL,
	db_host_user_name VARCHAR(250) NOT NULL,
	created_by INT NULL UNIQUE,
	created_date INT NULL,
	updated_by INT NULL,
	update_date INT NULL,
	status SMALLINT DEFAULT 1,
	CONSTRAINT chk_oci_configuration_status CHECK (status IN (1, 2, 3)),
	FOREIGN KEY (created_by) REFERENCES user_info(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (updated_by) REFERENCES user_info(id)
);

CREATE TABLE IF NOT EXISTS `cpu_type` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	keyid VARCHAR(250) NOT NULL,
	value VARCHAR(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS `memory` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	keyid VARCHAR(250) NOT NULL,
	value VARCHAR(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS `local_storage` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	keyid VARCHAR(250) NOT NULL,
	value VARCHAR(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS `data_transfer` (
	id INT AUTO_INCREMENT PRIMARY KEY,
	compartment_name VARCHAR(250) NOT NULL,
	compartment_id VARCHAR(250) NOT NULL,
	cpu_type_id INT NOT NULL,
	memory_id INT NOT NULL,
	local_storage_id INT NOT NULL,
	image VARCHAR(250) NOT NULL,
	display_name VARCHAR(250) NOT NULL,
	created_by INT NULL UNIQUE,
	created_date INT NULL,
	updated_by INT NULL,
	update_date INT NULL,
	status SMALLINT DEFAULT 1,
	CONSTRAINT chk_data_transfer_status CHECK (status IN (1, 2, 3)),
	FOREIGN KEY (created_by) REFERENCES user_info(id),
	FOREIGN KEY (updated_by) REFERENCES user_info(id),
	FOREIGN KEY (cpu_type_id) REFERENCES cpu_type(id),
	FOREIGN KEY (memory_id) REFERENCES memory(id),
	FOREIGN KEY (local_storage_id) REFERENCES local_storage(id)
);
