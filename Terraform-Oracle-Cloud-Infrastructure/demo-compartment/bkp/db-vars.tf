variable "db_system_shape" {
  default = "VM.Standard2.2"
}

variable "cpu_core_count" {
  default = "2"
}

variable "db_edition" {
  default = "ENTERPRISE_EDITION_EXTREME_PERFORMANCE"
}

variable "db_version" {
  default = "19.6.0.0"
}

variable "db_disk_redundancy" {
  default = "HIGH"
}

variable "db_host_user_name" {
  default = "opc"
}

variable "db_n_character_set" {
  default = "AL16UTF16"
}

variable "db_character_set" {
  default = "AL32UTF8"
}

variable "db_workload" {
  default = "OLTP"
}

variable "db_data_storage_size_in_gb" {
  default = "256"
}

variable "db_license_model" {
  default = "BRING_YOUR_OWN_LICENSE"
}

variable "db_node_count" {
  default = "2"
}

variable "db_data_storage_percentage" {
  default = "40"
}

variable "dbsystems_bootstrap" {
  description = "Public SSH keys path to be included in the ~/.ssh/authorized_keys file for the default user on the instance. "
  default     = "cloudinit/dbsystems_bootstrap"
}

variable "db_info" {
  type = map

  default = {
    db-system1 = {
      db_admin_password      = "put-complex-password-here"
      db_name                = "dbname1"
      db_home_display_name   = "dbname1-dbhome"
      db_system_display_name = "db-system-display-name"
      db_hostname            = "db-hostname"
      db_pdb_name            = "pdbname"
      db_backup_auto         = true
      db_backup_retention    = 30
      db_backup_schedule     = "02:00 AM - 04:00 AM"
      db_ad_name             = "eu-frankfurt-2"
      db_system_cluster_name = "db-cluster-name"
      db_version             = "19.6.0.0"
      db_system_shape        = "VM.Standard2.8"
    }
    db-system2 = {
      db_admin_password      = "put-complex-password-here"
      db_name                = "dbname2"
      db_home_display_name   = "dbname2-dbhome"
      db_system_display_name = "db-system-display-name"
      db_hostname            = "db-hostname"
      db_pdb_name            = "pdbname"
      db_backup_auto         = true
      db_backup_retention    = 30
      db_backup_schedule     = "02:00 AM - 04:00 AM"
      db_ad_name             = "eu-frankfurt-2"
      db_system_cluster_name = "db-cluster-name"
      db_version             = "19.3.0.0"
      db_system_shape        = "VM.Standard2.2"
    }
  }
}
