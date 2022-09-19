/*
 * Wazuh app - React component building the configuration component.
 *
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, BottomBar } from './components';
import { useKbnLoadingIndicator} from '../../common/hooks';
import { useForm } from '../../common/form/hooks';
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiSpacer,
  Query,
} from '@elastic/eui';
import store from '../../../redux/store'
import { updateSelectedSettingsSection } from '../../../redux/actions/appStateActions';
import { withUserAuthorizationPrompt, withErrorBoundary, withReduxProvider } from '../../common/hocs';
import { EpluginSettingType, PLUGIN_PLATFORM_NAME, PLUGIN_SETTINGS, PLUGIN_SETTINGS_CATEGORIES, UI_LOGGER_LEVELS, WAZUH_ROLE_ADMINISTRATOR_NAME } from '../../../../common/constants';
import { compose } from 'redux';
import { formatSettingValueFromForm, getPluginSettingDescription, getSettingDefaultValue, getSettingsDefaultList } from '../../../../common/services/settings';
import _ from 'lodash';
import { Category } from './components/categories/components';
import { WzRequest } from '../../../react-services';
import { UIErrorLog, UIErrorSeverity, UILogLevel, UI_ERROR_SEVERITIES } from '../../../react-services/error-orchestrator/types';
import { getErrorOrchestrator } from '../../../react-services/common-services';
import { getToasts } from '../../../kibana-services';
import { updateAppConfig } from '../../../redux/actions/appConfigActions';
import path from 'path';

export type ISetting = {
  key: string
  value: boolean | string | number | object
  description: string
  category: string
  name: string
  readonly?: boolean
  form: { type: string, params: {} }
};

const pluginSettingConfigurableUI = getSettingsDefaultList()
  .filter(categorySetting => categorySetting.configurableUI)
  .map(setting => ({ ...setting, category: PLUGIN_SETTINGS_CATEGORIES[setting.category].title}));

const settingsCategoriesSearchBarFilters = [...new Set(pluginSettingConfigurableUI.map(({category}) => category))].sort().map(category => ({value: category}))

const transformToSettingsByCategories = (settings) => {
  const settingsSortedByCategories = settings.reduce((accum, pluginSettingConfiguration) => ({
    ...accum,
    [pluginSettingConfiguration.category]: [
      ...(accum[pluginSettingConfiguration.category] || []),
      {...pluginSettingConfiguration}
    ]
  }),{})
  return Object.entries(settingsSortedByCategories)
    .map(([category, settings]) => ({ category,settings }))
    .filter(categoryEntry => categoryEntry.settings.length);
};

const pluginSettingsConfigurableUI = configuration => Object.fromEntries(
  getSettingsDefaultList()
    .filter(pluginSetting => pluginSetting.configurableUI)
    .map(({
      key,
      type,
      validate,
      default: initialValue,
      transformUIInputValue,
      toUIInput,
      toUIOutput,
      ...rest
    }) => ([
      key, 
      {
        type,
        validate: validate?.bind?.(rest),
        transformInputValue: transformUIInputValue?.bind?.(rest),
        transformOutputValue: toUIOutput?.bind?.(rest),
        initialValue: toUIInput ? toUIInput.bind(rest)(configuration?.[key] ?? initialValue) : (configuration?.[key] ?? initialValue)
      }
    ]))
);


const WzConfigurationSettingsProvider = (props) => {
  const [loading, setLoading ] = useKbnLoadingIndicator();
  const [query, setQuery] = useState('');
  // const [settingsByCategories, setSettingsByCategories] = useState(transformToSettingsByCategories(pluginSettingConfigurableUI));
  const currentConfiguration = useSelector(state => state.appConfig.data);

  const { fields, changed, errors, doneChanges, undoneChanges } = useForm(pluginSettingsConfigurableUI(currentConfiguration));
  const dispatch = useDispatch();

  useEffect(() => {
    store.dispatch(updateSelectedSettingsSection('configuration'));
  }, []);

  const onChangeSearchQuery = (query) => {
    setQuery(query);
  };

  const visibleSettings = Object.entries(fields)
    .map(([fieldKey, fieldForm]) => ({
      ...fieldForm,
      key: fieldKey,
      category: PLUGIN_SETTINGS_CATEGORIES[PLUGIN_SETTINGS[fieldKey].category].title,
      type: PLUGIN_SETTINGS[fieldKey].type,
      options: PLUGIN_SETTINGS[fieldKey]?.options,
      title: PLUGIN_SETTINGS[fieldKey]?.title,
      description: getPluginSettingDescription(PLUGIN_SETTINGS[fieldKey]),
    }));

  // https://github.com/elastic/eui/blob/aa4cfd7b7c34c2d724405a3ecffde7fe6cf3b50f/src/components/search_bar/query/query.ts#L138-L163
  const search = Query.execute(query.query || query, visibleSettings, ['description', 'key', 'title']);

  const visibleCategories = transformToSettingsByCategories(search || visibleSettings);

  const onSave = async () => {
    setLoading(true);
    try {
      const settingsToUpdate = Object.entries(changed).reduce((accum, [pluginSettingKey, currentValue]) => {
        if(PLUGIN_SETTINGS[pluginSettingKey].configurableFile && PLUGIN_SETTINGS[pluginSettingKey].type === EpluginSettingType.filepicker){
          accum.fileUpload = {
            ...accum.fileUpload,
            [pluginSettingKey]: {
              file: currentValue,
              extension: path.extname(currentValue.name)
            }
          }
        }else if(PLUGIN_SETTINGS[pluginSettingKey].configurableFile){
          accum.saveOnConfigurationFile = {
            ...accum.saveOnConfigurationFile,
            [pluginSettingKey]: formatSettingValueFromForm(pluginSettingKey, currentValue)
          }
        };
        return accum;
      }, {saveOnConfigurationFile: {}, fileUpload: {}});

      const requests = [];

      // Update the settings that doesn't upload a file
      if(Object.keys(settingsToUpdate.saveOnConfigurationFile).length){
        requests.push(WzRequest.genericReq(
          'PUT', '/utils/configuration',
          settingsToUpdate.saveOnConfigurationFile
        ));
      };

      // Update the settings that uploads a file
      if(Object.keys(settingsToUpdate.fileUpload).length){
        requests.push(...Object.entries(settingsToUpdate.fileUpload)
          .map(([pluginSettingKey, {file, extension}]) => {
              // Create the form data
              const formData = new FormData();
              formData.append('file', file);
              formData.append('extension', extension);
              return WzRequest.genericReq(
                'PUT', `/utils/configuration/files/${pluginSettingKey}`,
                formData,
                {overwriteHeaders: {'content-type': 'multipart/form-data'}}
              )
            }));            
      };

      const responses = await Promise.all(requests);      

      // Show the toasts if necessary
      responses.some(({data: { data: {requireRestart}}}) => requireRestart) && toastRequireRestart();
      responses.some(({data: { data: {requireReload}}}) => requireReload) && toastRequireReload();
      responses.some(({data: { data: {requireHealtCheck}}}) => requireHealtCheck) && toastRequireHealthcheckExecution();

      // Update the app configuration frontend-cached setting in memory with the new values
      dispatch(updateAppConfig({
        ...responses.reduce((accum, {data: {data}}) => {
          return {
            ...accum,
            ...(data.updatedConfiguration ? {...data.updatedConfiguration} : {}),
          }
        },{})
      }));

      // Remove the selected files on the file picker inputs
      if(Object.keys(settingsToUpdate.fileUpload).length){
        Object.keys(settingsToUpdate.fileUpload).forEach(settingKey => {
          console.log({dsadsa: fields[settingKey].inputRef});
          try{
            fields[settingKey].inputRef.removeFiles(
              // This method uses some methods of a DOM event.
              // Because we want to remove the files when the configuration is saved,
              // there is no event, so we create a object that contains the
              // methods used to remove the files. Of this way, we can skip the errors
              // due to missing methods.
              // This workaround is based in @elastic/eui v29.3.2
              // https://github.com/elastic/eui/blob/v29.3.2/src/components/form/file_picker/file_picker.tsx#L107-L108
              {stopPropagation: () => {}, preventDefault: () => {}}
            );
          }catch(error){
            // TODO: There is an error related to accessing to `target` of undefined
            // that we should review it.
          }
        });
      };

      // Show the success toast
      successToast();

      // Reset the form changed configuration
      doneChanges();
    } catch (error) {
      const options: UIErrorLog = {
        context: `${WzConfigurationSettingsProvider.name}.onSave`,
        level: UI_LOGGER_LEVELS.ERROR as UILogLevel,
        severity: UI_ERROR_SEVERITIES.BUSINESS as UIErrorSeverity,
        store: true,
        error: {
          error: error,
          message: error.message || error,
          title: `Error saving the configuration: ${error.message || error}`,
        },
      };

      getErrorOrchestrator().handleError(options);
    } finally {
      setLoading(false);
    };
  };

  return (
    <EuiPage >
      <EuiPageBody className='mgtPage__body' restrictWidth>
        <EuiPageHeader>
          <Header
            query={query}
            setQuery={onChangeSearchQuery}
            searchBarFilters={[{
              type: 'field_value_selection',
              field: 'category',
              name: 'Categories',
              multiSelect: 'or',
              options: settingsCategoriesSearchBarFilters,
            }]}/>
        </EuiPageHeader>
        <EuiFlexGroup direction='column'>
          {visibleCategories && visibleCategories.map(({category, settings}) => ( 
            <Category 
              key={`configuration_category_${category}`}
              title={category}
              items={settings}
              currentConfiguration={currentConfiguration}
            />
            )
          )}
        </EuiFlexGroup>
        <EuiSpacer size="xxl" />
        {Object.keys(changed).length > 0 && (
          <BottomBar
            errorsCount={Object.keys(errors).length}
            unsavedCount={Object.keys(changed).length}
            onCancel={undoneChanges}
            onSave={onSave}
          />
        )}
      </EuiPageBody>
    </EuiPage>
  );
}
export const WzConfigurationSettings = compose (
  withErrorBoundary,
  withReduxProvider,
  withUserAuthorizationPrompt(null, [WAZUH_ROLE_ADMINISTRATOR_NAME])
)(WzConfigurationSettingsProvider);

const toastRequireReload = () => {
  getToasts().add({
    color: 'success',
    title: 'This setting require you to reload the page to take effect.',
    text: <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
      <EuiFlexItem grow={false}>
        <EuiButton onClick={() => window.location.reload()} size="s">Reload page</EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  });
};

const toastRequireHealthcheckExecution = () => {
  const toast = getToasts().add({
    color: 'warning',
    title: 'You must execute the health check for the changes to take effect',
    toastLifeTimeMs: 5000,
    text:
      <EuiFlexGroup alignItems="center" gutterSize="s">
        <EuiFlexItem grow={false} >
          <EuiButton onClick={() => {
            getToasts().remove(toast);
            window.location.href = '#/health-check';
          }} size="s">Execute health check</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
  });
};

const toastRequireRestart = () => {
  getToasts().add({
    color: 'warning',
    title: `You must restart ${PLUGIN_PLATFORM_NAME} for the changes to take effect`,
  });
};

const successToast = () => {
  getToasts().add({
    color: 'success',
    title: 'The configuration has been successfully updated',
  });
};
