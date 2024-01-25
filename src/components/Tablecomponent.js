import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed', border: '1px solid #B9B9B9' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};



const columns = [
  {
        width: 5,
        label: 'id',
        dataKey: 'ids',
 },
  {
    width: 5,
    label: 'Title',
    dataKey: 'title',
  },
  {
    width: 5,
    label: 'Due',
    dataKey: 'due_date',
  },
  {
    width: 5,
    label: 'Tag',
    dataKey: 'tag',
  },
  {
    width: 2,
    label: 'Status',
    dataKey: 'status',
  },
  {
    width: 70,
    label: 'Assigned',
    dataKey: 'assigned_name',
  },
  {
    width: 70,
    label: 'Reporting',
    dataKey: 'reporting_name',
  },
  {
    width: 5,
    label: 'Action',
    dataKey: 'View',
  },
];



const ReactVirtualizedTable = ({data ,setdetail}) => {
    useEffect(() => {
        const updatedRows = data.map((row, index) => ({ ...row, ids: index + 1  , View : "View" ,assigned_name :row.assigned_to?.name ,reporting_name : row.reporting_person?.name}));
        setRows(updatedRows);
      }, [data]);

    const [rows, setRows] = useState(data);

    const handleViewClick = (rowData) => {
      console.log(rowData);
      setdetail(rowData)
      // Add any additional logic or actions you want to perform on view click
    };

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column ,index) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align='left'

          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column ,index) => (
          <TableCell
            key={column.dataKey}
            align= 'left'
            // style={{
            //     borderBottom: '1px solid #B9B9B9',
            //     borderRight: index === columns.length - 1 ? 'none' : '1px solid #B9B9B9',
            //   }}
          >
           
          {column.dataKey === 'View' ? (
            <button onClick={() => handleViewClick(row)}>{row[column.dataKey]}</button>
          ) : column.dataKey === 'tag' && Array.isArray(row.tag) ? (
            row.tag.map((tag, tagIndex) => (
              <div key={tagIndex}>{tag}</div>
            ))
          )  : (
            row[column.dataKey]
          )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  return (
    <Paper style={{ height: "300px", width: '1000px', margin: "auto" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
};

export default ReactVirtualizedTable;
