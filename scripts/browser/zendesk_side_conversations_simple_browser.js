// Paste this entire script into the Chrome DevTools console on your Zendesk agent workspace
// (same origin as the API). You must already be signed in so /api/v2/... requests are authorized.
//
// Ticket IDs are read from ticket-ids.json next to this file when you run it from a local
// static server. If the fetch fails or the list is empty, nothing is processed.
// To refresh the list from a Google Sheet: copy the ID column, then run:
//   node scripts/update-ticket-ids-from-sheets.js
// (paste IDs, Ctrl+D) — see that script’s header comment.

// Load ticket IDs from JSON file
async function loadTicketIds() {
  try {
    const response = await fetch('./ticket-ids.json');
    const data = await response.json();
    return data.ticketIds || [];
  } catch (error) {
    console.error('Error loading ticket IDs:', error);
    return [];
  }
}

// Zendesk Side Conversations API for this ticket
async function fetchSideConversations(ticketId) {
  const response = await fetch(`/api/v2/tickets/${ticketId}/side_conversations.json`);
  return response.json();
}

async function fetchAllSideConversations() {
  const ticketIds = await loadTicketIds();
  const results = [];

  console.log(`Fetching side conversations for ${ticketIds.length} tickets...`);
  
  for (let i = 0; i < ticketIds.length; i++) {
    const ticketId = ticketIds[i];
    
    try {
      console.log(`Ticket ${ticketId} (${i + 1}/${ticketIds.length})`);
      const response = await fetchSideConversations(ticketId);
      
      const sideConversations = response.side_conversations || [];
      // Slack Connect side convos expose a slack participant email on the conversation
      const slackSideConversations = sideConversations.filter(
        conv => conv.participants && conv.participants.some(p => p.email && p.email.includes('slack'))
      );
      const slackSideConversationCount = slackSideConversations.length;

      results.push({
        ticketId: ticketId,
        slackSideConversationCount: slackSideConversationCount
      });
      
      await new Promise(resolve => setTimeout(resolve, 100)); // light rate limit
      
    } catch (error) {
      console.error(`Error with ticket ${ticketId}:`, error.message);
    }
  }
  
  return results;
}

// Two-column CSV for spreadsheets: ticket id, count of Slack-linked side conversations
function convertToCSV(data) {
  const headers = ['Ticket Number', 'Slack Side Conversation Count'];
  const csvRows = [headers.join(',')];

  data.forEach(item => {
    csvRows.push([item.ticketId, item.slackSideConversationCount].join(','));
  });

  return csvRows.join('\n');
}

function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

async function main() {
  const results = await fetchAllSideConversations();
  
  console.log(`\nCompleted! Fetched ${results.length} tickets.`);
  
  const totalSlackSideConversations = results.reduce((sum, item) => sum + item.slackSideConversationCount, 0);
  const ticketsWithSlackSideConversations = results.filter(item => item.slackSideConversationCount > 0).length;

  console.log(`\nSummary:`);
  console.log(`- Total Slack side conversations: ${totalSlackSideConversations}`);
  console.log(`- Tickets with at least one Slack side conversation: ${ticketsWithSlackSideConversations}`);
  
  const csvData = convertToCSV(results);
  downloadCSV(csvData, 'zendesk_side_conversations.csv');
  console.log('CSV downloaded!');
  
  console.log('Full results:', results);
}

main();

