/*
 * Wazuh app - Module for Wazuh utils routes
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { WazuhUtilsCtrl } from '../../controllers';
import { IRouter } from 'kibana/server';
import { schema } from '@kbn/config-schema';
import { EpluginSettingType, PLUGIN_SETTINGS } from '../../../common/constants';

export function WazuhUtilsRoutes(router: IRouter) {
  const ctrl = new WazuhUtilsCtrl();

  // Returns the wazuh.yml file parsed
  router.get(
    {
      path: '/utils/configuration',
      validate: false
    },
    async (context, request, response) => ctrl.getConfigurationFile(context, request, response)
  );

  // Returns the wazuh.yml file in raw
  router.put(
    {
      path: '/utils/configuration',
      validate: {
        body: schema.object(Object.entries(PLUGIN_SETTINGS).filter(([, {configurableFile}]) => configurableFile).reduce((accum, [pluginSettingKey, pluginSettingConfiguration]) => ({
          ...accum,
          [pluginSettingKey]: schema.maybe(pluginSettingConfiguration.validateBackend ? pluginSettingConfiguration.validateBackend(schema) : schema.any())
        }), {}))
      }
    },
    async (context, request, response) => ctrl.updateConfigurationFile(context, request, response)
  );

  const pluginSettingsTypeFilepicker = Object.entries(PLUGIN_SETTINGS)
    .filter(([_, {type, configurableFile}]) => type === EpluginSettingType.filepicker && configurableFile);

  const schemaPluginSettingsTypeFilepicker = schema.oneOf(pluginSettingsTypeFilepicker.map(([pluginSettingKey]) => schema.literal(pluginSettingKey)));

  // Upload an asset
  router.put(
    {
      path: '/utils/configuration/files/{key}',
      validate: {
        params: schema.object({
          // key parameter should be a plugin setting of `filepicker` type
          key: schemaPluginSettingsTypeFilepicker
        }),
        body: schema.object({
          // file: buffer
          file: schema.buffer(),
          // extension: literal of all the extensions of plugin setting of `filepicker` type
          extension: schema.oneOf([...new Set(
            ...pluginSettingsTypeFilepicker
              .map(([ , pluginSettingConfiguration]) => ([...pluginSettingConfiguration.options.file.extensions]))
          )].map(schema.literal))
        })
      }
    },
    async (context, request, response) => ctrl.uploadFile(context, request, response)
  );

  // Remove an asset
  router.delete(
    {
      path: '/utils/configuration/files/{key}',
      validate: {
        params: schema.object({
          // key parameter should be a plugin setting of `filepicker` type
          key: schemaPluginSettingsTypeFilepicker
        })
      }
    },
    async (context, request, response) => ctrl.deleteFile(context, request, response)
  );

  // Returns Wazuh app logs
  router.get(
    {
      path: '/utils/logs',
      validate: false
    },
    async (context, request, response) => ctrl.getAppLogs(context,request, response)
  );
}
