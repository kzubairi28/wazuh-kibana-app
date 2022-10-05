import { PLUGIN_SETTINGS } from "./constants";

describe('[settings] Input validation', () => {
    it.each`
    setting                             | value                             | expectedValidation
    ${'alerts.sample.prefix'}           | ${'test'}                         | ${undefined}
    ${'alerts.sample.prefix'}           | ${''}                             | ${"Value can not be empty."}
    ${'alerts.sample.prefix'}           | ${'test space'}                   | ${"It can't contain spaces."}
    ${'alerts.sample.prefix'}           | ${'-test'}                        | ${"It can't start with: -, _, +, .."}
    ${'alerts.sample.prefix'}           | ${'_test'}                        | ${"It can't start with: -, _, +, .."}
    ${'alerts.sample.prefix'}           | ${'+test'}                        | ${"It can't start with: -, _, +, .."}
    ${'alerts.sample.prefix'}           | ${'.test'}                        | ${"It can't start with: -, _, +, .."}
    ${'alerts.sample.prefix'}           | ${'test\\'}                       | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test/'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test?'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test"'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test<'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test>'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test|'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test,'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test#'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'alerts.sample.prefix'}           | ${'test*'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'checks.api'}                     | ${true}                           | ${undefined}
    ${'checks.api'}                     | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.fields'}                  | ${true}                           | ${undefined}
    ${'checks.fields'}                  | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.maxBuckets'}              | ${true}                           | ${undefined}
    ${'checks.maxBuckets'}              | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.pattern'}                 | ${true}                           | ${undefined}
    ${'checks.pattern'}                 | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.setup'}                   | ${true}                           | ${undefined}
    ${'checks.setup'}                   | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.template'}                | ${true}                           | ${undefined}
    ${'checks.template'}                | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'checks.timeFilter'}              | ${true}                           | ${undefined}
    ${'checks.timeFilter'}              | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'cron.prefix'}                    | ${'test'}                         | ${undefined}
    ${'cron.prefix'}                    | ${'test space'}                   | ${"It can't contain spaces."}
    ${'cron.prefix'}                    | ${''}                             | ${"Value can not be empty."}
    ${'cron.prefix'}                    | ${'-test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.prefix'}                    | ${'_test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.prefix'}                    | ${'+test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.prefix'}                    | ${'.test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.prefix'}                    | ${'test\\'}                       | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test/'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test?'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test"'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test<'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test>'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test|'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test,'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test#'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.prefix'}                    | ${'test*'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.apis'}           | ${['test']}                       | ${undefined}
    ${'cron.statistics.apis'}           | ${['test ']}                      | ${"It can't contain spaces."}
    ${'cron.statistics.apis'}           | ${['']}                           | ${"Value can not be empty."}
    ${'cron.statistics.apis'}           | ${['test', 4]}                    | ${"Value is not a string."}    
    ${'cron.statistics.apis'}           | ${'test space'}                   | ${"Value is not a valid list."}
    ${'cron.statistics.apis'}           | ${true}                           | ${"Value is not a valid list."}
    ${'cron.statistics.index.creation'} | ${'h'}                            | ${undefined}
    ${'cron.statistics.index.creation'} | ${'d'}                            | ${undefined}
    ${'cron.statistics.index.creation'} | ${'w'}                            | ${undefined}
    ${'cron.statistics.index.creation'} | ${'m'}                            | ${undefined}
    ${'cron.statistics.index.creation'} | ${'test'}                         | ${"Invalid value. Allowed values: h, d, w, m."}
    ${'cron.statistics.index.name'}     | ${'test'}                         | ${undefined}
    ${'cron.statistics.index.name'}     | ${''}                             | ${"Value can not be empty."}
    ${'cron.statistics.index.name'}     | ${'test space'}                   | ${"It can't contain spaces."}
    ${'cron.statistics.index.name'}     | ${'-test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.statistics.index.name'}     | ${'_test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.statistics.index.name'}     | ${'+test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.statistics.index.name'}     | ${'.test'}                        | ${"It can't start with: -, _, +, .."}
    ${'cron.statistics.index.name'}     | ${'test\\'}                       | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test/'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test?'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test"'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test<'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test>'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test|'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test,'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test#'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.name'}     | ${'test*'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #, *."}
    ${'cron.statistics.index.replicas'} | ${0}                              | ${undefined}
    ${'cron.statistics.index.replicas'} | ${-1}                             | ${"Value should be greater or equal than 0."}
    ${'cron.statistics.index.shards'}   | ${1}                              | ${undefined}
    ${'cron.statistics.index.shards'}   | ${-1}                             | ${"Value should be greater or equal than 1."}
    ${'cron.statistics.interval'}       | ${'0 */5 * * * *'}                | ${undefined}
    ${'cron.statistics.interval'}       | ${'0 */5 * * *'}                  | ${undefined}
    ${'cron.statistics.interval'}       | ${'custom'}                       | ${"Interval is not valid."}
    ${'cron.statistics.interval'}       | ${true}                           | ${"Interval is not valid."}
    ${'cron.statistics.status'}         | ${true}                           | ${undefined}
    ${'cron.statistics.status'}         | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'customization.reports.footer'}   | ${'Test'}                         | ${undefined}
    ${'customization.reports.footer'}   | ${'Test\nTest'}                   | ${undefined}
    ${'customization.reports.footer'}   | ${'Test\nTest\nTest\nTest\nTest'} | ${"The string should have less or equal to 2 line/s."}
    ${'customization.reports.header'}   | ${'Test'}                         | ${undefined}
    ${'customization.reports.header'}   | ${'Test\nTest'}                   | ${undefined}
    ${'customization.reports.header'}   | ${'Test\nTest\nTest\nTest\nTest'} | ${"The string should have less or equal to 4 line/s."}
    ${'disabled_roles'}                 | ${['test']}                       | ${undefined}
    ${'disabled_roles'}                 | ${['']}                           | ${'Value can not be empty.'}
    ${'disabled_roles'}                 | ${['test space']}                 | ${"It can't contain spaces."}
    ${'disabled_roles'}                 | ${['test', 4]}                    | ${"Value is not a string."}    
    ${'enrollment.dns'}                 | ${'test'}                         | ${undefined}
    ${'enrollment.dns'}                 | ${''}                             | ${undefined}
    ${'enrollment.dns'}                 | ${'test space'}                   | ${"It can't contain spaces."}
    ${'enrollment.password'}            | ${'test'}                         | ${undefined}
    ${'enrollment.password'}            | ${''}                             | ${"Value can not be empty."}
    ${'enrollment.password'}            | ${'test space'}                   | ${undefined}
    ${'extensions.audit'}               | ${true}                           | ${undefined}
    ${'extensions.audit'}               | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.aws'}                 | ${true}                           | ${undefined}
    ${'extensions.aws'}                 | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.ciscat'}              | ${true}                           | ${undefined}
    ${'extensions.ciscat'}              | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.gcp'}                 | ${true}                           | ${undefined}
    ${'extensions.gcp'}                 | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.gdpr'}                | ${true}                           | ${undefined}
    ${'extensions.gdpr'}                | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.hipaa'}               | ${true}                           | ${undefined}
    ${'extensions.hipaa'}               | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.nist'}                | ${true}                           | ${undefined}
    ${'extensions.nist'}                | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.oscap'}               | ${true}                           | ${undefined}
    ${'extensions.oscap'}               | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.osquery'}             | ${true}                           | ${undefined}
    ${'extensions.osquery'}             | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.pci'}                 | ${true}                           | ${undefined}
    ${'extensions.pci'}                 | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.tsc'}                 | ${true}                           | ${undefined}
    ${'extensions.tsc'}                 | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'extensions.virustotal'}          | ${true}                           | ${undefined}
    ${'extensions.virustotal'}          | ${0}                              | ${'It should be a boolean. Allowed values: true or false.'}
    ${'ip.ignore'}                      | ${['test']}                       | ${undefined}
    ${'ip.ignore'}                      | ${['test*']}                      | ${undefined}
    ${'ip.ignore'}                      | ${['']}                           | ${'Value can not be empty.'}
    ${'ip.ignore'}                      | ${['test space']}                 | ${"It can't contain spaces."}
    ${'ip.ignore'}                      | ${true}                           | ${"Value is not a valid list."}
    ${'ip.ignore'}                      | ${['-test']}                      | ${"It can't start with: -, _, +, .."}
    ${'ip.ignore'}                      | ${['_test']}                      | ${"It can't start with: -, _, +, .."}
    ${'ip.ignore'}                      | ${['+test']}                      | ${"It can't start with: -, _, +, .."}
    ${'ip.ignore'}                      | ${['.test']}                      | ${"It can't start with: -, _, +, .."}
    ${'ip.ignore'}                      | ${['test\\']}                     | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test/']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test?']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test"']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test<']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test>']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test|']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test,']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test#']}                      | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.ignore'}                      | ${['test', 'test#']}              | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'ip.selector'}                    | ${true}                           | ${undefined}
    ${'ip.selector'}                    | ${''}                             | ${'It should be a boolean. Allowed values: true or false.'}
    ${'logs.level'}                     | ${'info'}                         | ${undefined}
    ${'logs.level'}                     | ${'debug'}                        | ${undefined}
    ${'logs.level'}                     | ${''}                             | ${'Invalid value. Allowed values: info, debug.'}
    ${'pattern'}                        | ${'test'}                         | ${undefined}
    ${'pattern'}                        | ${'test*'}                        | ${undefined}
    ${'pattern'}                        | ${''}                             | ${'Value can not be empty.'}
    ${'pattern'}                        | ${'test space'}                   | ${"It can't contain spaces."}
    ${'pattern'}                        | ${'-test'}                        | ${"It can't start with: -, _, +, .."}
    ${'pattern'}                        | ${'_test'}                        | ${"It can't start with: -, _, +, .."}
    ${'pattern'}                        | ${'+test'}                        | ${"It can't start with: -, _, +, .."}
    ${'pattern'}                        | ${'.test'}                        | ${"It can't start with: -, _, +, .."}
    ${'pattern'}                        | ${'test\\'}                       | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test/'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test?'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test"'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test<'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test>'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test|'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test,'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'pattern'}                        | ${'test#'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'timeout'}                        | ${15000}                          | ${undefined}
    ${'timeout'}                        | ${1000}                           | ${'Value should be greater or equal than 1500.'}
    ${'timeout'}                        | ${''}                             | ${'Value should be greater or equal than 1500.'}
    ${'wazuh.monitoring.creation'}      | ${'h'}                            | ${undefined}
    ${'wazuh.monitoring.creation'}      | ${'d'}                            | ${undefined}
    ${'wazuh.monitoring.creation'}      | ${'w'}                            | ${undefined}
    ${'wazuh.monitoring.creation'}      | ${'m'}                            | ${undefined}
    ${'wazuh.monitoring.creation'}      | ${'test'}                         | ${"Invalid value. Allowed values: h, d, w, m."}
    ${'wazuh.monitoring.enabled'}       | ${true}                           | ${undefined}
    ${'wazuh.monitoring.frequency'}     | ${100}                            | ${undefined}
    ${'wazuh.monitoring.frequency'}     | ${40}                             | ${"Value should be greater or equal than 60."}
    ${'wazuh.monitoring.pattern'}       | ${'test'}                         | ${undefined}
    ${'wazuh.monitoring.pattern'}       | ${'test*'}                        | ${undefined}
    ${'wazuh.monitoring.pattern'}       | ${''}                             | ${'Value can not be empty.'}
    ${'wazuh.monitoring.pattern'}       | ${'-test'}                        | ${"It can't start with: -, _, +, .."}
    ${'wazuh.monitoring.pattern'}       | ${'_test'}                        | ${"It can't start with: -, _, +, .."}
    ${'wazuh.monitoring.pattern'}       | ${'+test'}                        | ${"It can't start with: -, _, +, .."}
    ${'wazuh.monitoring.pattern'}       | ${'.test'}                        | ${"It can't start with: -, _, +, .."}
    ${'wazuh.monitoring.pattern'}       | ${'test\\'}                       | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test/'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test?'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test"'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test<'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test>'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test|'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test,'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.pattern'}       | ${'test#'}                        | ${"It can't contain invalid characters: \\, /, ?, \", <, >, |, ,, #."}
    ${'wazuh.monitoring.replicas'}      | ${0}                              | ${undefined}
    ${'wazuh.monitoring.replicas'}      | ${-1}                             | ${"Value should be greater or equal than 0."}
    ${'wazuh.monitoring.shards'}        | ${1}                              | ${undefined}
    ${'wazuh.monitoring.shards'}        | ${-1}                             | ${"Value should be greater or equal than 1."}
    `('$setting | $value | $expectedValidation', ({ setting, value, expectedValidation }) => {
        expect(
            PLUGIN_SETTINGS[setting].validate(
                PLUGIN_SETTINGS[setting]?.uiFormTransformConfigurationValueToInputValue?.(value)
                ?? value
            )).toBe(expectedValidation);
    })
});
