// Definition of badge resource
// Sourced from:
// https://github.com/marmelab/react-admin/tree/master/examples/tutorial/src
// https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
// https://stackoverflow.com/questions/19743396
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
    SimpleForm,
    TextInput,
    BooleanField,
    BooleanInput
} from 'react-admin';
// import custom avatar components
import AvatarField from './AvatarField';
import AvatarInput from './AvatarInput';

// Define listing
export const BadgeList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <BooleanField source="active" />
            <TextField source="name" />
            <TextField source="description" />
            <AvatarField source="avatar" />
            <DateField source="updatedAt" />
            <EditButton basePath="/badges" />
        </Datagrid>
    </List>
);

// Define edit/display page
export const BadgeEdit = props => (
    <Edit title={<BadgeTitle />} {...props}>
        <SimpleForm>
            <TextField source="id" disabled />
            <BooleanInput label="Active" source="active" />
            <TextInput source="name" />
            <TextInput source="description" options={{ multiline: true }} />
            <AvatarInput source="avatar" />
        </SimpleForm>
    </Edit>
);

// Define create page
export const BadgeCreate = props => (
    <Create title="Create a Badge" {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" options={{ multiline: true }} />
        </SimpleForm>
    </Create>
);

// Define title of edit page
const BadgeTitle = ({ record }) => {
    return <span>Badge {record ? `"${record.name}"` : ''}</span>;
};
// Define props of title component
BadgeTitle.propTypes = {
    record: PropTypes.oneOfType([PropTypes.object])
};
