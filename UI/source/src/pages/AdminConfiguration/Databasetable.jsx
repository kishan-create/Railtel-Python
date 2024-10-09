import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
 { field: 'id', headerName: 'ID ', width: 40 },
  { field: 'dbname', headerName: 'DB name ', width: 100 },
  { field: 'dbid', headerName: 'DB ID ', width: 100 },
  { field: 'instance', headerName: 'Instance', width: 100 },
  {
    field: 'version',
    headerName: 'Version', 
    width: 90,
  },
  {
    field: 'hostname',
    headerName: 'Host name', 
    width: 100, 
  },
  {
    field: 'platform',
    headerName: 'Platform', 
    width: 100, 
  },
];

const rows = [
  { id: 1, dbname: 'sample', dbid: 'sample', instance: 'sample', version: 'sample', hostname: 'sample', platform: 'sample'},
  { id: 2, dbname: 'sample', dbid: 'sample', instance: 'sample', version: 'sample', hostname: 'sample', platform: 'sample'},
  
];

export default function DataTable() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        
      />
    </div>
  );
}