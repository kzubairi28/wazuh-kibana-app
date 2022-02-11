/*
 * Wazuh app - React Test component SubscriptionTab
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React from 'react';
import { SubscriptionTab } from './SubscriptionTab';
import { mount } from 'enzyme';

jest.mock(
  '../../../../../../../../../../../../kibana/node_modules/@elastic/eui/lib/services/accessibility/html_id_generator',
  () => ({
    htmlIdGenerator: () => () => 'htmlId',
  })
);

describe('SubscriptionTab component', () => {
  it('renders correctly to match the snapshot', () => {
    const wodleConfiguration = {
      office365: {
        enabled: 'yes',
        only_future_events: 'yes',
        interval: 600,
        curl_max_size: 1024,
        api_auth: [
          {
            tenant_id: 'your_tenant_id_test',
            client_id: 'your_client_id_test',
            client_secret: 'your_secret_test',
          },
        ],
        subscriptions: [
          'Audit.AzureActiveDirectory',
          'Audit.Exchange',
          'Audit.SharePoint',
          'Audit.General',
          'DLP.All',
        ],
      },
    };
    const agent = { id: '000' };

    const wrapper = mount(
      <SubscriptionTab wodleConfiguration={wodleConfiguration} agent={agent} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
