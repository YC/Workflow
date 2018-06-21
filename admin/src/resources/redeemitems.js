// Definition of redeem item resource
import React from 'react';
import PropTypes from 'prop-types';

// Import react-admin components
import {
    DateField,
    List,
    Edit,
    Datagrid,
    TextField,
    EditButton,
    DisabledInput,
    SimpleForm,
    NumberField,
    SelectInput,
    ReferenceField
} from 'react-admin';

// Define listing
export const RedeemItemList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="status" />
            <ReferenceField
                label="Member"
                source="memberID"
                reference="members"
            >
                <TextField source="username" />
            </ReferenceField>
            <NumberField source="rep" />
            <DateField source="updatedAt" />
            <EditButton basePath="/redeemed" />
        </Datagrid>
    </List>
);

// Define edit/display page
export const RedeemItemEdit = props => (
    <Edit title={<RedeemItemTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <SelectInput
                source="status"
                choices={[
                    { id: 'Pending', name: 'Pending' },
                    { id: 'Approved', name: 'Approved' },
                    { id: 'Rejected', name: 'Rejected' }
                ]}
            />
        </SimpleForm>
    </Edit>
);

// Define title of edit page
const RedeemItemTitle = ({ record }) => {
    return <span>RedeemItem {record ? `"${record.name}"` : ''}</span>;
};
// Define props of title component
RedeemItemTitle.propTypes = {
    record: PropTypes.oneOfType([PropTypes.object])
};
