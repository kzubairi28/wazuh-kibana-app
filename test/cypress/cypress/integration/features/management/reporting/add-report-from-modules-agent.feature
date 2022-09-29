Feature: Generating reports from module and agents

  As a Wazuh user
  i want to generate a report from modules and agents
  in order to could access to the report from management/reporting

@report
Scenario Outline: Create a report from modules and agents <Module Name>
    Given The wazuh admin user is logged
    When The user goes to <Module Name>
    And The user generate a module report clicking on the generate report option
    And The user choose an agent to apply filter
    And The user generate a module report clicking on the generate report option
    And The user navigates to management-reporting
    Then The agent report is displayed in the table
    Examples:
      | Module Name          |
      | Security Events      |
      | Integrity Monitoring |
      | System Auditing      |
      | Mitre & Attack       |
      | NIST                 |
      | TSC                  |
      | Policy Monitoring    |
      | PCIDSS               |