"""
Filename     : runner.py
Purpose      : Automation script which creates several reports.
"""

#!/usr/bin/env python3.7

import modules.create_folders as m_create_folders
import modules.delete_folders as m_delete_folders
import modules.extract_meta_data as m_extract_meta_data
import modules.json_to_csv as json
import modules.extract_functions as extract
import modules.run_scripts as m_report_scripts

def main():

    m_create_folders.main()

    m_extract_meta_data.main()

    # m_report_scripts.main()

    m_delete_folders.main()

main()
