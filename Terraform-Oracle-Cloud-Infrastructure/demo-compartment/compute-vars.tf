# Defines the number of instances to deploy
variable "num_instances" {
  default = "1"
}

# Defines the number of volumes to create and attach to each instance
# NOTE: Changing this value after applying it could result in re-attaching existing volumes to different instances.
# This is a result of using 'count' variables to specify the volume and instance IDs for the volume attachment resource.
variable "num_iscsi_volumes_per_instance" {
  default = "0"
}

variable "num_paravirtualized_volumes_per_instance" {
  default = "0"
}

variable "instance_image_ocid" {
  type = map

  default = {
    # See https://docs.us-phoenix-1.oraclecloud.com/images/
    # Oracle-provided image "Oracle-Linux-7.7-2019.11.12-0"
    us-ashburn-1 = "ocid1.image.oc1.iad.aaaaaaaanmmjbkpu7u36kmi3yhlmncksxrnwrhjyox4ng3e5bff4lias7tka"
  }
}

variable "attachment_type" {
  default = "paravirtualized"
}

variable "attachment_type_shareable" {
  #default = "paravirtualized"
  default = "iscsi"
}

variable "backupPolicies" {
  default = "bronze"
}

variable "compute_info" {
  type = map

  default = {

    host1 = {
      compute_hostname         = "myhost1"
      compute_shape            = "VM.Standard2.1"
      compute_boot_volume_size = 60
      compute_dataVolumeName   = "myhost1_data"
      compute_dataVolumeSize   = 50
      compute_ad_name          = "us-ashburn-1"
    }
  }
}

variable "compute_ssh_authorized_keys" {
  description = "Public SSH keys path to be included in the ~/.ssh/authorized_keys file for the default user on the instance. "
  default     = "ssh_authorized_keys"
}
