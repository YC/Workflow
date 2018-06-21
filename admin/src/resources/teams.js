// Definition of team resource
// Sourced from
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
    ReferenceArrayField,
    SingleFieldList,
    ChipField,
    ReferenceArrayInput,
    SelectArrayInput
} from 'react-admin';

// Define listing
export const TeamList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <BooleanField source="active" />
            <TextField source="shortName" />
            <TextField source="name" />
            <NumberField source="rep" />
            <ReferenceArrayField
                label="Members"
                reference="members"
                source="members"
            >
                <SingleFieldList>
                    <ChipField source="username" />
                </SingleFieldList>
            </ReferenceArrayField>
            <ReferenceArrayField
                label="Managers"
                reference="members"
                source="managers"
            >
                <SingleFieldList>
                    <ChipField source="username" />
                </SingleFieldList>
            </ReferenceArrayField>
            <DateField source="updatedAt" />
            <EditButton basePath="/Teams" />
        </Datagrid>
    </List>
);

// Define edit/display page
export const TeamEdit = props => (
    <Edit title={<TeamTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <BooleanInput label="Active" source="active" />
            <DisabledInput source="avatar" />
            <ReferenceArrayInput source="members" reference="members">
                <SelectArrayInput optionText="username" />
            </ReferenceArrayInput>
            <ReferenceArrayInput source="managers" reference="members">
                <SelectArrayInput optionText="username" />
            </ReferenceArrayInput>
            <TextInput source="shortName" />
            <TextInput source="name" />
            <NumberInput source="rep" />
        </SimpleForm>
    </Edit>
);

// Define create page
export const TeamCreate = props => (
    <Create title="Create a Team" {...props}>
        <SimpleForm>
            <TextInput source="shortName" />
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

// Define the title format (for edit page)
const TeamTitle = ({ record }) => {
    return <span>Team {record ? `"${record.name}"` : ''}</span>;
};
// Define props of title component
TeamTitle.propTypes = {
    record: PropTypes.oneOfType([PropTypes.object])
};
