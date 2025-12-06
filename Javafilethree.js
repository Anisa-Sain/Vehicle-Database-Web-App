
import { createClient } from 
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://vjaflirzzxtjcajafwec.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWZsaXJ6enh0amNhamFmd2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjQ5NTcsImV4cCI6MjA2MTAwMDk1N30.VRBzBiCcCuHRrzkl1DyRFvZ8avkg3QPb-9MZCIrNcr8')

document.addEventListener('DOMContentLoaded', () => {
    const ownerInput = document.getElementById('owner');
    const checkBtn = document.getElementById('search-owner-button');
    checkBtn.disabled = true;
    ownerInput.addEventListener('input', () => {
        checkBtn.disabled = ownerInput.value.trim() === '';
    });

    document.getElementById('search-owner-button').addEventListener('click', async (e) => {e.preventDefault();

        const ownerName = document.getElementById('owner').value.trim();
        const resultsDiv = document.getElementById('owner-results');
        const formContainer = document.getElementById('new-owner-form-container');
        resultsDiv.innerHTML = '';
        formContainer.innerHTML = '';


        if (!ownerName) {
            alert('Enter owner name to search.');
            return;
        }

        const { data, error } = await supabase
            .from('People')
            .select('*')
            .ilike('Name', `%${ownerName}%`);

        //added <div to orngae
        if (error) {
            console.error('Search error:', error);
            resultsDiv.innerHTML = `<div>Error occurred while searching.</div>`;
            return;
        }

        if (data.length === 0) {
            resultsDiv.innerHTML = `<div>No owner found. Enter new owner info.</div>`;
            showNewOwnerForm();
        } else {
            //added
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'owner-matches';
           
            resultsDiv.innerHTML = `<p>Select an owner:</p>`;


            data.forEach(person => {
                //added
                const personDiv = document.createElement('div');
                personDiv.className = 'owner-result';

                
                personDiv.innerHTML = `
                <p><strong>Name:</strong> ${person.Name || 'N/A'}</p>
                <p><strong>Address:</strong> ${person.Address || 'N/A'}</p>
                <p><strong>DOB:</strong> ${person.DOB || 'N/A'}</p>
                <p><strong>License:</strong> ${person.LicenseNumber || 'N/A'}</p>
                <p><strong>Expiry:</strong> ${person.ExpiryDate || 'N/A'}</p>
            `;

                const selectBtn = document.createElement('button');
                selectBtn.textContent = 'Select owner';
                selectBtn.className = 'select-btn';
                selectBtn.onclick = () => addVehicle(person.PersonID);
                
                personDiv.appendChild(selectBtn);
                resultsContainer.appendChild(personDiv);
            });
            
            const noMatchDiv = document.createElement('div');
            noMatchDiv.className = 'no-match';
 
            
            const noMatchBtn = document.createElement('button');
            noMatchBtn.textContent = 'New owner';
            noMatchBtn.onclick = showNewOwnerForm;
            
            noMatchDiv.appendChild(noMatchBtn);
            resultsContainer.appendChild(noMatchDiv);
            resultsDiv.appendChild(resultsContainer);
        }
    });





    function showNewOwnerForm() {
        const container = document.getElementById('new-owner-form-container');
        
        container.innerHTML = `
            <h3>Enter New Owner Details</h3>
            <input type="text" id="name" placeholder="Name" required />
            <input type="text" id="address" placeholder="Address" required />
            <input type="text" id="dob" placeholder="DOB YYYY-MM-DD" required />
            <input type="text" id="license" placeholder="License number" required />
            <input type="text" id="expire" placeholder="Expiry date YYYY-MM-DD" required />
            <button id="save-owner">Add owner</button>
            <div id="message-owner" style="margin-top:10px; font-weight:bold;"></div> 
        `;
//added that last line
        



        document.getElementById('save-owner').onclick = async (e) => {

            e.preventDefault(); 
            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const dob = document.getElementById('dob').value;
            const license = document.getElementById('license').value.trim();
            const expire = document.getElementById('expire').value;



            //added recent
            const messageOwner = document.getElementById('message-owner');
            messageOwner.textContent = '';
            messageOwner.style.color = 'black';
             
            if (!name || !address || !dob || !license || !expire) {
                messageOwner.textContent = 'Error: All owner fields are required.';
                messageOwner.style.color = 'red';
                return;
            }




            // - added error: searcherro
            const { data: existing, error: searchError } = await supabase
            .from('People')
            .select('PersonID')   //changed from * to personid
            .eq('Name', name)
            .eq('Address', address)
            .eq('DOB', dob);
            //.eq('LicenseNumber', license);
            //.eq('ExpiryDate', expire);

            //added
            if (searchError) {
                console.error("Search error:", searchError);
                messageOwner.textContent = 'Error: Could not verify owner.';
                messageOwner.style.color = 'red';
                return;
            }

            if (existing.length > 0) {
                messageOwner.textContent = 'Error: Owner with identical information already exists.';
                messageOwner.style.color = 'red';


                return;
            }

            const { data, error } = await supabase
            .from('People')
            .insert([{ 
                Name: name,
                Address: address, 
                DOB: dob,
                LicenseNumber: license,
                ExpiryDate: expire,
            }])
            .select();
            

            if (error) {
                console.error('Insert error:', error);
                messageOwner.textContent = 'Error: Could not save owner.';
                messageOwner.style.color = 'red';

                return;
            }
            //addded recently
            messageOwner.textContent = 'Owner added successfully.';
            messageOwner.style.color = 'green';

            const newOwnerId = data[0].PersonID;
            addVehicle(newOwnerId); // Reuse the same vehicle info
        };
    }

    async function addVehicle(ownerId) {
        const rego = document.getElementById('rego').value.trim();
        const make = document.getElementById('make').value.trim();
        const model = document.getElementById('model').value.trim();
        const colour = document.getElementById('colour').value.trim();
        const messageVehicle = document.getElementById('message-vehicle');

            // Clear previous message
        messageVehicle.textContent = '';
        messageVehicle.style.color = 'black';

        if (!rego || !make || !model || !colour) {
            messageVehicle.textContent = 'Error: All vehicle fields are required.';
            messageVehicle.style.color = 'red';
            return;
        }

        const { error } = await supabase.from('Vehicles').insert({
            VehicleID: rego,
            Make: make,
            Model: model,
            Colour: colour,
            OwnerID: ownerId
        });

        if (error) {
            messageVehicle.textContent = 'Error: Could not add vehicle.';
            messageVehicle.style.color = 'red';
            console.error(error);
        } else {
            messageVehicle.textContent = 'Vehicle added successfully';
            messageVehicle.style.color = 'green';
        }
    }
});