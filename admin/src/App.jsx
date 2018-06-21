// Adapted from:
// https://github.com/marmelab/react-admin/tree/master/examples/tutorial/src
// Licensed under MIT

import React from 'react';
import { Admin, Resource } from 'react-admin';

// Import auth/data provider
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import addUploadCapabilities from './dataUpload';

// Import resources
import { BadgeList, BadgeEdit, BadgeCreate } from './resources/badges';
import {
    RedeemableList,
    RedeemableEdit,
    RedeemableCreate
} from './resources/redeemables';
import { RedeemItemList, RedeemItemEdit } from './resources/redeemitems';
import { MemberList, MemberEdit, MemberCreate } from './resources/members';
import { TeamList, TeamEdit, TeamCreate } from './resources/teams';
import theme from './theme';

// Define App Components
class App extends React.Component {
    render() {
        return (
            <Admin
                title="Workflow Admin"
                theme={theme}
                dataProvider={addUploadCapabilities(dataProvider)}
                authProvider={authProvider}
            >
                <Resource
                    name="members"
                    list={MemberList}
                    edit={MemberEdit}
                    create={MemberCreate}
                />
                <Resource
                    name="teams"
                    list={TeamList}
                    edit={TeamEdit}
                    create={TeamCreate}
                />
                <Resource
                    name="badges"
                    list={BadgeList}
                    edit={BadgeEdit}
                    create={BadgeCreate}
                />
                <Resource
                    name="redeems"
                    list={RedeemableList}
                    edit={RedeemableEdit}
                    create={RedeemableCreate}
                />
                <Resource
                    name="redeemed"
                    options={{ label: 'Redeemed' }}
                    list={RedeemItemList}
                    edit={RedeemItemEdit}
                />
            </Admin>
        );
    }
}

export default App;
