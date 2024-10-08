import React from 'react'
import PropTypes from 'prop-types'
import { CellBoolean, cellBooleanFormatter, CellTip } from 'src/components/tables'
import { DatatableContentCard } from 'src/components/contentcards'
import { faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons'
import { cellGenericFormatter } from 'src/components/tables/CellGenericFormat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CButton } from '@coreui/react'
import { ModalService } from 'src/components/utilities'
import { useLazyGenericGetRequestQuery } from 'src/store/api/app'

const rowStyle = (row, rowIndex) => {
  const style = {}

  return style
}

const DeleteMailboxRuleButton = (tenantDomain, ruleId, userPrincipalName, ruleName) => {
  const [genericGetRequest, getResults] = useLazyGenericGetRequestQuery()
  const handleModal = (modalMessage, modalUrl) => {
    ModalService.confirm({
      body: (
        <div style={{ overflow: 'visible' }}>
          <div>{modalMessage}</div>
        </div>
      ),
      title: 'Confirm',
      onConfirm: () => genericGetRequest({ path: modalUrl }),
    })
  }
  return (
    <CButton
      color="danger"
      variant="ghost"
      onClick={() => {
        ModalService.confirm(
          handleModal(
            'Are you sure you want to remove this mailbox rule?',
            `/api/ExecRemoveMailboxRule?TenantFilter=${tenantDomain}&ruleId=${ruleId}&ruleName=${ruleName}&userPrincipalName=${userPrincipalName}`,
          ),
        )
      }}
    >
      <FontAwesomeIcon icon={faTrash} />
    </CButton>
  )
}

export default function UserMailboxRuleList({ userId, userEmail, tenantDomain, className = null }) {
  const formatter = (cell) => CellBoolean({ cell })
  const columns = [
    {
      selector: (row) => row['Name'],
      name: 'Display Name',
      sortable: true,
      cell: (row) => CellTip(row['Name']),
      exportSelector: 'Name',
      width: '200px',
    },
    {
      selector: (row) => row['Description'],
      name: 'Description',
      sortable: true,
      cell: (row) => CellTip(row['Description']),
      exportSelector: 'Description',
      width: '350px',
    },
    {
      selector: (row) => row['ForwardTo'],
      name: 'Forwards To',
      sortable: true,
      cell: (row) => CellTip(row['ForwardTo']),
      exportSelector: 'ForwardTo',
      width: '250px',
    },
    {
      selector: (row) => row['RedirectTo'],
      name: 'Redirect To',
      sortable: true,
      cell: (row) => CellTip(row['RedirectTo']),
      exportSelector: 'RedirectTo',
      maxwidth: '250px',
    },
    {
      selector: (row) => row['CopyToFolder'],
      name: 'Copy To Folder',
      sortable: true,
      cell: (row) => CellTip(row['CopyToFolder']),
      exportSelector: 'CopyToFolder',
      maxwidth: '200px',
    },
    {
      selector: (row) => row['MoveToFolder'],
      name: 'Move To Folder',
      sortable: true,
      cell: (row) => CellTip(row['MoveToFolder']),
      exportSelector: 'MoveToFolder',
      maxwidth: '200px',
    },
    {
      selector: (row) => row['DeleteMessage'],
      name: 'Delete Message',
      sortable: true,
      cell: cellBooleanFormatter({ colourless: true }),
      formatter,
      exportSelector: 'DeleteMessage',
      width: '200px',
    },
    {
      name: 'Action',
      maxWidth: '100px',
      cell: (row) => DeleteMailboxRuleButton(tenantDomain, row['Identity'], userEmail, row['Name']),
    },
  ]
  return (
    <DatatableContentCard
      title="User Mailbox Rules"
      icon={faEnvelope}
      className={className}
      datatable={{
        reportName: 'ListUserMailboxRules',
        path: '/api/ListUserMailboxRules',
        params: { tenantFilter: tenantDomain, userId, userEmail },
        columns,
        keyField: 'id',
        responsive: true,
        dense: true,
        rowStyle: rowStyle,
        striped: true,
      }}
    />
  )
}

UserMailboxRuleList.propTypes = {
  userId: PropTypes.string.isRequired,
  userEmail: PropTypes.string,
  tenantDomain: PropTypes.string.isRequired,
  className: PropTypes.string,
}
