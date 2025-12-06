

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://vjaflirzzxtjcajafwec.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWZsaXJ6enh0amNhamFmd2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjQ5NTcsImV4cCI6MjA2MTAwMDk1N30.VRBzBiCcCuHRrzkl1DyRFvZ8avkg3QPb-9MZCIrNcr8'
);

document.getElementById('submit').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const license = document.getElementById('license').value.trim();
  const message = document.getElementById('message');

  const results = document.getElementById('results');



  results.innerHTML = '';
  message.textContent = '';

  if ((!name && !license) || (name && license)) {
    message.textContent = 'Error: Please enter either a name or license number';
    return;
  }

  if (name) {
   
    const { data, error } = await supabase
      .from('People')
      .select('*')
      .ilike('Name', `%${name}%`);

    if (error || !data || data.length === 0) {
      message.textContent = 'No result found';
      return;
    }

    message.textContent = 'Search successful';

    data.forEach(person => {
      const card = document.createElement('div');
      card.className = 'person-card';
      card.innerHTML = `
        <h3><strong>Person ID:</strong> ${person.PersonID || 'N/A'}</h3>
        <p><strong>Name:</strong> ${person.Name || 'N/A'}</p>
        <p><strong>Address:</strong> ${person.Address || 'N/A'}</p>
        <p><strong>DOB:</strong> ${person.DOB || 'N/A'}</p>
        <p><strong>License Number:</strong> ${person.LicenseNumber || 'N/A'}</p>
        <p><strong>Expiration Date:</strong> ${person.ExpiryDate || 'N/A'}</p>
      `;
      results.appendChild(card);
    });
  } else {
    
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('Vehicles')
      .select('*')
   
      .ilike('VehicleID', `%${license}%`);   //changeed

    if (vehicleError || !vehicleData || vehicleData.length === 0) {
      message.textContent = 'No result found';
      return;
    }

    const ownerIds = [...new Set(vehicleData.map(v => v.OwnerID))];


    //  look up the owner
    const { data: ownersData, error: ownersError } = await supabase
      .from('People')
      .select('*')
      .in('PersonID', ownerIds);


    message.textContent = 'Search successful';




    const ownersMap = new Map();
    ownersData.forEach(owner => ownersMap.set(owner.PersonID, owner));

    
    vehicleData.forEach(vehicle => {
      const owner = ownersMap.get(vehicle.OwnerID);



      const card = document.createElement('div');
      card.className = 'person-card';
      card.innerHTML = `
        
        <h3><strong>Owner Name:</strong> ${owner?.Name || 'N/A'}</h3>
        <p><strong>Address:</strong> ${owner?.Address || 'N/A'}</p>
        <p><strong>DOB:</strong> ${owner?.DOB || 'N/A'}</p>
        <p><strong>License Number:</strong> ${owner?.LicenseNumber || 'N/A'}</p>
        <p><strong>Expiration Date:</strong> ${owner?.ExpiryDate || 'N/A'}</p>
      `;
      results.appendChild(card);
    });
  }
});

