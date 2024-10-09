/*
# LICENSE UPL 1.0
#
# Copyright (c) 1982-2018 Oracle and/or its affiliates. All rights reserved.
# 
# Initial version : July, 2019
# Author: Oracle Consulting France
# Description: Create compartment structure
# 
# DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
*/

# Information to store tfstate file in a bucket
terraform {
  backend "s3" {
    endpoint = "compat.objectstorage.eu-frankfurt-1.oraclecloud.com"
    region   = "eu-frankfurt-1"                        # or us-ashburn-1
    bucket   = "tenant"                                 # Put the tenant name here
    key      = "bucket-name/terraform.tfstate" # This should contain "[OCI_BUCKET_NAME]/[OBJECT_NAME]"
    # To create access key see : https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm#s3
    #access_key =  # Put access_key here or in ~/.aws/credentials, section [default]
    #secret_key =  # Put secret key here or in ~/.aws/credentials, section [default]
    # All S3-specific validations are skipped:
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_get_ec2_platforms      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
  }
}
