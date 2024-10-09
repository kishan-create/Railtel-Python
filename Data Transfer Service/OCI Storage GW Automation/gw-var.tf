# Variables Compute
variable "ad_availability_domain"      { type = string }
variable "compartment_ocid"   { type = string }
variable "vnic_assign_public_ip"   { type = string }
variable "instance_display_name"      { type = string }
variable "subnet_id"        { type = string }
variable "instance_fault_domain"     { type = string }
variable "instance_launch_options_boot_volume_type"         { type = string }
variable "instance_launch_options_firmware"         { type = string }
variable "instance_launch_options_is_consistent_volume_naming_enabled"       { type = string }
variable "instance_launch_options_is_pv_encryption_in_transit_enabled"         { type = string }
variable "instance_launch_options_network_type"         { type = string }
variable "instance_launch_options_remote_data_volume_type"         { type = string }
variable "instance_shape"         { type = string }
variable "instance_shape_config_baseline_ocpu_utilization"         { type = string }
variable "instance_shape_config_memory_in_gbs"         { type = string }
variable "instance_shape_config_ocpus"         { type = string }
variable "instance_source_details_boot_volume_vpus_per_gb"         { type = string }
variable "image_id"         { type = string }

# Variables Volume

variable "volume_display_name"         { type = string }
variable "volume_is_auto_tune_enabled"         { type = string }
variable "volume_size_in_gbs"         { type = string }
variable "volume_vpus_per_gb"         { type = string }

# Variables Volume Attachment

variable "volume_attachment_attachment_type"         { type = string }
variable "volume_attachment_device"         { type = string }
variable "volume_attachment_display_name"         { type = string }
variable "volume_attachment_is_pv_encryption_in_transit_enabled"         { type = string }
variable "volume_attachment_is_read_only"         { type = string }


variable "opc_ssh_private_key" {
  description = "OPC ssh private KEY to be used for remote exec"
  default     = "opc_ssh_private_key"
}

variable "opc_ssh_public_key" {
  description = "OPC Public SSH keys path to be included in the ~/.ssh/authorized_keys file for the default user on the instance."
  default     = "opc_ssh_public_key"
}


variable "source_details"         { type = string }
variable "destination_details"         { type = string }
