import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
 { field: 'id', headerName: 'ID ', width: 70 },
  { field: 'snapid', headerName: 'Snap ID ', width: 130 },
  { field: 'snaptime', headerName: 'Snap time ', width: 130 }, 
];

const rows = [
  { id: 1, snapid: 'Begin snap', snaptime: 'Sample'},
  { id: 2, snapid: 'End snap', snaptime: 'Sample'},
];

export default function DataTablenew() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        
      />
    </div>
  );
}