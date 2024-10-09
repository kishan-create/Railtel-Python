import os

# Creates folders
def main():
    print("Creating folders...")
    
    # root directory
    root_path = '../results/'

    # folders to create
    folders = [
        'volume_attached',
        'vnic_attached',
        'vcn',
        'instances',
        'images',
        'boot_attached',
        'boot',
        'vnic',
        'subnet',
        'compile',
        'volume',
        'bucket',
        'default_route',
        'security_list',
        'internet_gateway',
        'drg',
        'fast_connect',
        'public_ip',
        'drg_attachment',
        'virtual_circuit',
        'load_balancer',
        'volume_backup',
        'volume_backup_policy',
        'backup',
        'dbaas',
        'private_ip',
        'nodes',
        'nodes_ip',
        'billable_report',
        'boot_backup',
        'boot_backup_volumes',
        'shape',
        'compartments',
        'availability_domain',
        'default_route_rules'
    ]

    # Loop throught folder names and check if it has been created.
    for folder in folders:
        # If not created, create folder
        if not os.path.exists(root_path + folder):
            os.mkdir(os.path.join(root_path,folder))
