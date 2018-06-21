// Definition of redeemable resource
// Sourced from:
// https://github.com/marmelab/react-admin/tree/master/examples/tutorial/src
// Licensed under MIT

import React from 'react';
import PropTypes from 'prop-types';

// Import react-admin components
import {
    DateField,
    List,
    Edit,
    Create,
    Datagrid,
    TextField,
    EditButton,
    DisabledInput,
    SimpleForm,
    TextInput,
    BooleanField,
    BooleanInput,
    NumberField,
    NumberInput
} from 'react-admin';

// Define listing
export const RedeemableList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <BooleanField source="active" />
            <TextField source="name" />
            <TextField source="description" />
            <NumberField source="rep" />
            <DateField source="updatedAt" />
            <EditButton basePath="/redeems" />
        </Datagrid>
    </List>
);

// Define edit/display page
export const RedeemableEdit = props => (
    <Edit title={<RedeemableTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <BooleanInput label="Active" source="active" />
            <TextInput source="name" />
            <TextInput source="description" options={{ multiline: true }} />
            <NumberInput source="rep" />
        </SimpleForm>
    </Edit>
);

// Define create page
export const RedeemableCreate = props => (
    <Create title="Create a Redeemable" {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" options={{ multiline: true }} />
            <NumberInput source="rep" />
        </SimpleForm>
    </Create>
);

// Define title of edit page
const RedeemableTitle = ({ record }) => {
    return <span>Redeemable {record ? `"${record.name}"` : ''}</span>;
};
// Define props of title component
RedeemableTitle.propTypes = {
    record: PropTypes.oneOfType([PropTypes.object])
};
