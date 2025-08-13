
// Inflation Calculator Functionality
function calculateInflation() {
    const amount = parseFloat(document.getElementById('amount').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const resultDiv = document.getElementById('result');
    
    // Validate inputs
    if (!amount || !startDate || !endDate) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">⚠️ Por favor, completá todos los campos</p>';
        return;
    }
    
    if (amount <= 0) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">⚠️ El monto debe ser mayor a cero</p>';
        return;
    }
    
    // Calculate time difference
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    const monthsDiff = daysDiff / 30.44; // Average days per month
    
    if (daysDiff <= 0) {
        resultDiv.innerHTML = '<p style="color: #dc3545;">⚠️ La fecha final debe ser posterior a la inicial</p>';
        return;
    }
    
    // Simulate inflation calculation (using approximate Argentine inflation rates)
    // This is a simplified calculation for demonstration
    let monthlyInflationRate;
    const currentYear = new Date().getFullYear();
    const startYear = start.getFullYear();
    
    // Estimated monthly inflation rates based on historical data
    if (startYear >= 2023) {
        monthlyInflationRate = 0.08; // ~8% monthly (recent high inflation)
    } else if (startYear >= 2020) {
        monthlyInflationRate = 0.04; // ~4% monthly
    } else if (startYear >= 2015) {
        monthlyInflationRate = 0.025; // ~2.5% monthly
    } else {
        monthlyInflationRate = 0.02; // ~2% monthly
    }
    
    // Calculate final amount using compound interest formula
    const finalAmount = amount * Math.pow(1 + monthlyInflationRate, monthsDiff);
    const totalInflation = ((finalAmount - amount) / amount) * 100;
    const annualizedInflation = (Math.pow(1 + monthlyInflationRate, 12) - 1) * 100;
    
    // Format results
    const formattedAmount = amount.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
    
    const formattedFinalAmount = finalAmount.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
    
    // Display results
    resultDiv.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: #28a745; margin-bottom: 1rem;">📊 Resultado del Cálculo</h3>
            <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;">
                <p><strong>Monto inicial:</strong> ${formattedAmount}</p>
                <p><strong>Monto ajustado:</strong> ${formattedFinalAmount}</p>
                <p><strong>Inflación total:</strong> ${totalInflation.toFixed(2)}%</p>
                <p><strong>Inflación mensual promedio:</strong> ${(monthlyInflationRate * 100).toFixed(2)}%</p>
                <p><strong>Inflación anualizada:</strong> ${annualizedInflation.toFixed(2)}%</p>
                <p><strong>Período:</strong> ${Math.round(monthsDiff)} meses</p>
            </div>
            <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: #155724;">
                💡 <strong>Interpretación:</strong> El poder adquisitivo de ${formattedAmount} 
                en ${formatDate(startDate)} equivale a ${formattedFinalAmount} en ${formatDate(endDate)}.
            </div>
        </div>
    `;
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Interactive table features
document.addEventListener('DOMContentLoaded', function() {
    // Add click functionality to table rows
    const tableRows = document.querySelectorAll('.inflation-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove previous selections
            tableRows.forEach(r => r.classList.remove('selected'));
            // Add selection to current row
            this.classList.add('selected');
            
            // Get year and inflation data
            const year = this.cells[0].textContent;
            const inflation = this.cells[1].textContent;
            
            // Show information
            showYearInfo(year, inflation);
        });
    });
    
    // Add hover effects and animations
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Auto-focus on amount input
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.focus();
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            calculateInflation();
        }
    });
});

// Function to show year information
function showYearInfo(year, inflation) {
    const info = document.createElement('div');
    info.className = 'year-info-popup';
    info.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 1000; max-width: 400px;">
            <h3 style="color: #2c3e50; margin-bottom: 1rem;">📈 Año ${year}</h3>
            <p><strong>Inflación Anual:</strong> ${inflation}</p>
            <p style="margin: 1rem 0; color: #6c757d;">
                ${getYearDescription(year)}
            </p>
            <button onclick="closeYearInfo()" style="background: #dc3545; color: white; border: none; 
                                                     padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                Cerrar
            </button>
        </div>
        <div onclick="closeYearInfo()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                              background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;
    
    document.body.appendChild(info);
}

// Function to close year info popup
function closeYearInfo() {
    const popup = document.querySelector('.year-info-popup');
    if (popup) {
        popup.remove();
    }
    
    // Remove selection from table rows
    const tableRows = document.querySelectorAll('.inflation-table tbody tr');
    tableRows.forEach(row => row.classList.remove('selected'));
}

// Function to get year descriptions
function getYearDescription(year) {
    const descriptions = {
        '1989': 'El año de la hiperinflación más severa en la historia argentina moderna, con una tasa anual que superó el 3000%.',
        '1990': 'Continuación de la crisis hiperinflacionaria del año anterior, aunque con una leve reducción.',
        '1984': 'Período de alta inflación durante el gobierno de Alfonsín, marcado por la crisis de la deuda externa.',
        '1976': 'Inicio del llamado "Proceso de Reorganización Nacional", con alta inflación estructural.',
        '1975': 'Último año del gobierno peronista antes del golpe militar, caracterizado por desequilibrios macroeconómicos.',
        '1959': 'Plan de estabilización de Frondizi, con ajustes que generaron alta inflación inicial.'
    };
    
    return descriptions[year] || 'Período de inflación significativa en la historia económica argentina.';
}

// Add CSS for selected table rows
const style = document.createElement('style');
style.textContent = `
    .inflation-table tbody tr.selected {
        background-color: #e3f2fd !important;
        border-left: 4px solid #2196f3;
    }
    
    .inflation-table tbody tr {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .inflation-table tbody tr:hover {
        background-color: #f8f9fa !important;
        transform: translateX(5px);
    }
`;
document.head.appendChild(style);

// Add smooth animations on page load
window.addEventListener('load', function() {
    const sections = document.querySelectorAll('section, article');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
