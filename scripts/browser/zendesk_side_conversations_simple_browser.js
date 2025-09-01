// Simple browser version - you're already authenticated!

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

// Fallback ticket IDs (if JSON file fails to load)
const fallbackTicketIds = [
  // Your ticket IDs here
  // Example: 2512915, 2512999, 2513129, etc.
];

async function getTicketIds() {
  const jsonTicketIds = await loadTicketIds();
  return jsonTicketIds.length > 0 ? jsonTicketIds : fallbackTicketIds;
}

async function fetchSideConversations(ticketId) {
  const response = await fetch(`/api/v2/tickets/${ticketId}/side_conversations.json`);
  return response.json();
}

async function fetchAllSideConversations() {
  const ticketIds = await getTicketIds();
  const results = [];
  
  console.log(`Fetching side conversations for ${ticketIds.length} tickets...`);
  
  for (let i = 0; i < ticketIds.length; i++) {
    const ticketId = ticketIds[i];
    
    try {
      console.log(`Ticket ${ticketId} (${i + 1}/${ticketIds.length})`);
      const response = await fetchSideConversations(ticketId);
      
      const sideConversations = response.side_conversations || [];
      const slackChannels = sideConversations
        .filter(conv => conv.participants && conv.participants.some(p => p.email && p.email.includes('slack')))
        .map(conv => {
          const slackParticipant = conv.participants.find(p => p.email && p.email.includes('slack'));
          return slackParticipant ? slackParticipant.email : 'Unknown Slack Channel';
        });
      
      results.push({
        ticketId: ticketId,
        sideConversationCount: sideConversations.length,
        slackChannels: slackChannels,
        allSideConversations: sideConversations.map(conv => ({
          id: conv.id,
          subject: conv.subject,
          state: conv.state,
          participants: conv.participants,
          preview_text: conv.preview_text,
          created_at: conv.created_at
        }))
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error with ticket ${ticketId}:`, error.message);
    }
  }
  
  return results;
}

function convertToCSV(data) {
  const headers = ['Ticket ID', 'Side Conversation Count', 'Slack Channels', 'All Side Conversation IDs', 'Side Conversation Subjects'];
  const csvRows = [headers.join(',')];
  
  data.forEach(item => {
    const slackChannelsText = item.slackChannels.join(' | ');
    const conversationIds = item.allSideConversations.map(conv => conv.id).join(' | ');
    const conversationSubjects = item.allSideConversations.map(conv => conv.subject).join(' | ');
    
    const row = [
      item.ticketId,
      item.sideConversationCount,
      `"${slackChannelsText.replace(/"/g, '""')}"`,
      `"${conversationIds}"`,
      `"${conversationSubjects.replace(/"/g, '""')}"`
    ];
    
    csvRows.push(row.join(','));
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
  
  const totalSideConversations = results.reduce((sum, item) => sum + item.sideConversationCount, 0);
  const ticketsWithSideConversations = results.filter(item => item.sideConversationCount > 0).length;
  const ticketsWithSlackChannels = results.filter(item => item.slackChannels.length > 0).length;
  
  console.log(`\nSummary:`);
  console.log(`- Total side conversations: ${totalSideConversations}`);
  console.log(`- Tickets with side conversations: ${ticketsWithSideConversations}`);
  console.log(`- Tickets with Slack channels: ${ticketsWithSlackChannels}`);
  
  const csvData = convertToCSV(results);
  downloadCSV(csvData, 'zendesk_side_conversations.csv');
  console.log('CSV downloaded!');
  
  console.log('Full results:', results);
}

main();

