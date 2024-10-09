import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
 { field: 'id', headerName: 'ID ', width: 40,  },
  { field: 'objecttype', headerName: 'Object Type', width: 100 },
  { field: 'objectcount', headerName: 'Object Count', width: 100, },
  { field: 'objecteligible', headerName: 'Object Not Eligible', width: 140 },
  {
    field: 'objecteligiblechange',
    headerName: 'Object Eligible with Changes', 
    width: 210,
  },
  {
    field: 'totaleligible',
    headerName: 'Total Eligible Objects', 
    width: 150, 
  },
   
];

const rows = [
  { id: 1, objecttype: 'Constraint', objectcount: '34', objecteligible: '0', objecteligiblechange: '0', totaleligible: '34'},
  { id: 2, objecttype: 'Directory', objectcount: '14', objecteligible: '14', objecteligiblechange: '0', totaleligible: '0'},
  { id: 3, objecttype: 'Index', objectcount: '18', objecteligible: '0', objecteligiblechange: '0', totaleligible: '18'},
  { id: 4, objecttype: 'Procedure', objectcount: '34', objecteligible: '0', objecteligiblechange: '0', totaleligible: '34'},
  { id: 5, objecttype: 'Sequence', objectcount: '14', objecteligible: '14', objecteligiblechange: '0', totaleligible: '0'},
  { id: 6, objecttype: 'Synonym', objectcount: '18', objecteligible: '0', objecteligiblechange: '0', totaleligible: '18'},
  { id: 7, objecttype: 'Table', objectcount: '34', objecteligible: '0', objecteligiblechange: '0', totaleligible: '34'},
  { id: 8, objecttype: 'Trigger', objectcount: '14', objecteligible: '14', objecteligiblechange: '0', totaleligible: '0'},
  { id: 9, objecttype: 'View', objectcount: '18', objecteligible: '0', objecteligiblechange: '0', totaleligible: '18'},
 
  
];

export default function Warehousetable() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        
      />
    </div>
  );
}