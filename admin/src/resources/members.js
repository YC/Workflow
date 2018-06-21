// Definition of member resource
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
    NumberInput,
    SelectInput
} from 'react-admin';

// Define listing
export const MemberList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <BooleanField source="active" />
            <TextField source="username" />
            <TextField source="firstname" />
            <TextField source="lastname" />
            <TextField source="type" />
            <NumberField source="rep" />
            <DateField source="updatedAt" />
            <EditButton basePath="/members" />
        </Datagrid>
    </List>
);

// Define edit/display page
export const MemberEdit = props => (
    <Edit title={<MemberTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <BooleanInput label="Active" source="active" />
            <TextInput source="username" />
            <TextInput source="firstname" />
            <TextInput source="lastname" />
            <TextInput source="email" />
            <NumberInput source="rep" />
            <SelectInput
                source="type"
                choices={[
                    { id: 'employee', name: 'Employee' },
                    { id: 'contractor', name: 'Contractor' }
                ]}
            />
        </SimpleForm>
    </Edit>
);

// Define create page
export const MemberCreate = props => (
    <Create title="Create a Member" {...props}>
        <SimpleForm>
            <TextInput source="username" />
            <TextInput source="password" />
            <TextInput source="firstname" />
            <TextInput source="lastname" />
            <TextInput source="email" />
            <SelectInput
                source="type"
                choices={[
                    { id: 'employee', name: 'Employee' },
                    { id: 'contractor', name: 'Contractor' }
                ]}
            />
        </SimpleForm>
    </Create>
);

// Define title of edit page
const MemberTitle = ({ record }) => {
    return (
        <span>
            Member {record ? `"${record.firstname} ${record.lastname}"` : ''}
        </span>
    );
};
// Define props of title component
MemberTitle.propTypes = {
    record: PropTypes.oneOfType([PropTypes.object])
};
