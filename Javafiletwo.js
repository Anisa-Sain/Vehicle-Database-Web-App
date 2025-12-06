
import { createClient } from 
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
 const supabase = createClient('https://vjaflirzzxtjcajafwec.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWZsaXJ6enh0amNhamFmd2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjQ5NTcsImV4cCI6MjA2MTAwMDk1N30.VRBzBiCcCuHRrzkl1DyRFvZ8avkg3QPb-9MZCIrNcr8')
 

 





document.getElementById('submit').addEventListener('click', async () => {
  const rego = document.getElementById('rego').value.trim();
  const message = document.getElementById('message');

  const results = document.getElementById('results');


  results.innerHTML = '';
  message.textContent = '';


  
  if (!rego) {
    message.textContent = 'Error: Registration number is required';
    return;
  }
  let query;
  if (rego) {
    query = supabase
      .from('Vehicles')
      .select('*')
      .ilike('VehicleID', `%${rego}%`);  
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error); 
    message.textContent = 'Error';
    return;
  }

  if (data.length === 0) {
    message.textContent = 'No result found';
    return;
  }



  message.textContent = 'Search successful';

  data.forEach(car => {
    const card = document.createElement('div');
    card.className = 'person-card';
    
    card.innerHTML = `
      <h3><strong>Car ID:</strong> ${car.VehicleID || 'N/A'}</h3>
      <p><strong>Make:</strong> ${car.Make || 'N/A'}</p>
      <p><strong>Model:</strong> ${car.Model || 'N/A'}</p>
      <p><strong>Colour:</strong> ${car.Colour || 'N/A'}</p>
      <p><strong>OwnerID:</strong> ${car.OwnerID || 'N/A'}</p>
    `;
    
    results.appendChild(card);
  });
});

