const { WAIT_TIMEOUT, SERVER_URL } = require('../common/constants');
const logger = require('../common/logger');

module.exports = async function (context, commands) {
  // Navigate to a URL, but do not measure the URL
  await commands.navigate(SERVER_URL);

  try {
    // Click on Kibana menu to access Wazuh App link
    await commands.wait.bySelector('button[data-test-subj="toggleNavButton"]', WAIT_TIMEOUT)
    await commands.click.bySelector('button[data-test-subj="toggleNavButton"]')
    await commands.wait.bySelector('a[href$="/app/wazuh"]', WAIT_TIMEOUT)
    await commands.click.bySelector('a[href$="/app/wazuh"]')
    
    //Wait for an Wazuh home page component to be loaded
    await commands.wait.byXpath('//*[contains(@class,"euiTitle euiTitle--small euiCard__title")]//*[contains(text(),"PCI DSS")]', WAIT_TIMEOUT)
    await commands.wait.byCondition("!isNaN(parseInt(document.querySelector('.statWithLink').innerHTML))", WAIT_TIMEOUT)
    await commands.click.byXpath('//*[contains(@class,"euiTitle euiTitle--small euiCard__title")]//*[contains(text(),"PCI DSS")]')

    // Start collecting metrics
    await commands.measure.start('PCI DSS module - Dashboard')
    logger('--- Initiate measures in Intelligence - Dashboard module ---');
    
    logger('--- PCI DSS requirements ---')
    await commands.wait.bySelector('#moduleDashboard .euiFlexItem.h-100 #Wazuh-App-Overview-PCI-DSS-requirements .visLib.visLib--legend-right', WAIT_TIMEOUT)

    logger('--- Top 10 agents by alerts number ---')
    await commands.wait.bySelector('#moduleDashboard .euiFlexItem.h-100 #Wazuh-App-Overview-PCI-DSS-Agents .visLib.visLib--legend-right', WAIT_TIMEOUT)
    
    logger('--- Top requirements over time ---')
    await commands.wait.bySelector('#moduleDashboard .euiFlexItem.h-100 #Wazuh-App-Overview-PCI-DSS-Requirements-over-time .visLib.visLib--legend-right', WAIT_TIMEOUT)
    
    logger('--- Requirements by agent ---')
    await commands.wait.bySelector('#moduleDashboard .euiFlexItem.h-100 #Wazuh-App-Overview-PCI-DSS-Requirements-by-agent .visLib.visLib--legend-right', WAIT_TIMEOUT)

    logger('--- Finish measures ---', 'info');
    
    // Stop and collect the metrics
    return commands.measure.stop();
  } catch (e) {
    // We try/catch so we will catch if the the input fields can't be found
    // The error is automatically logged in Browsertime an rethrown here
    // We could have an alternative flow ...
    // else we can just let it cascade since it caught later on and reported in
    // the HTML
    throw e;
  }
};