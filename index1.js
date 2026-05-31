
    function calculateFullTax() {
        // --- 1. Ստանալ արժեքները ---
        let turnoverInput = document.getElementById("turnover").value;
        let sectorSelect = document.getElementById("sector");
        let rate = parseFloat(sectorSelect.value);
        let employeesInput = document.getElementById("employees").value;
        let grossSalaryPerEmployeeInput = document.getElementById("salary").value;
        let otherExpensesInput = document.getElementById("expenses").value;

        // վերածում թվերի, դատարկ արժեքները 0
        let turnover = (turnoverInput === "") ? 0 : parseFloat(turnoverInput);
        let employees = (employeesInput === "") ? 0 : parseInt(employeesInput, 10);
        let grossSalaryPerEmployee = (grossSalaryPerEmployeeInput === "") ? 0 : parseFloat(grossSalaryPerEmployeeInput);
        let otherExpenses = (otherExpensesInput === "") ? 0 : parseFloat(otherExpensesInput);

        // Վալիդացիա բացասական թվերի դեպքում
        if (turnover < 0) turnover = 0;
        if (employees < 0) employees = 0;
        if (grossSalaryPerEmployee < 0) grossSalaryPerEmployee = 0;
        if (otherExpenses < 0) otherExpenses = 0;
        
        // աշխատողների քանակը ամբողջ թիվ
        employees = Math.floor(employees);
        
        // --- 2. Հաշվարկներ ըստ ՀՀ Շրջհարկի տրամաբանության ---
        // շրջհարկ = շրջանառություն * դրույք / 100
        let turnoverTax = turnover * (rate / 100);
        
        // Համախառն աշխատավարձի ֆոնդ (GROSS) = աշխատակիցների քանակ * մեկի համախառն աշխատավարձ
        let grossSalaryFund = employees * grossSalaryPerEmployee;
        
        // Եկամտային հարկ (20% համախառնից) – սա պահվում է աշխատողի աշխատավարձից,
        // բայց բիզնեսի ծախսում հանդես է գալիս համախառն ֆոնդի ամբողջ գումարը:
        let incomeTaxAmount = grossSalaryFund * 0.20;
        
        // Զուտ աշխատավարձի ֆոնդ (այն գումարը, որը աշխատակիցները ստանում են իրենց ձեռքը)
        let netSalaryFund = grossSalaryFund - incomeTaxAmount;
        
        // ԸՆԴՀԱՆՈՒՐ ԾԱԽՍ (ՃԻՇՏ) = Շրջհարկ + Համախառն աշխատավարձի ֆոնդ + Այլ ծախսեր
        // Եկամտային հարկը կրկին չենք ավելացնում, քանի որ արդեն մտնում է grossSalaryFund-ի մեջ
        let totalExpenses = turnoverTax + grossSalaryFund + otherExpenses;
        
        // Զուտ շահույթ = Շրջանառություն - Ընդհանուր ծախս
        let netProfit = turnover - totalExpenses;
        
        // Շահութաբերության տոկոս (եթե շրջանառությունը 0-ից մեծ)
        let profitMarginPercent = (turnover > 0) ? (netProfit / turnover) * 100 : 0;
        
        // --- 3. Ձևաչափում և ցուցադրում (hy-AM ֆորմատ, դրամ)---
        const formatMoney = (value) => {
            // կլորացնում ենք մինչև ամբողջ թիվ, ավելի ճիշտ դրամի համար
            let rounded = Math.round(value);
            return rounded.toLocaleString('hy-AM') + " դրամ";
        };
        
        const formatPercent = (value) => {
            return value.toFixed(2) + "%";
        };
        
        // արդյունքները տեղադրում ենք HTML-ում
        document.getElementById("taxResult").innerText = formatMoney(turnoverTax);
        document.getElementById("salaryFund").innerText = formatMoney(grossSalaryFund);
        document.getElementById("incomeTax").innerText = formatMoney(incomeTaxAmount);
        document.getElementById("netSalaryFund").innerText = formatMoney(netSalaryFund);
        document.getElementById("expenseResult").innerText = formatMoney(otherExpenses);
        document.getElementById("totalResult").innerText = formatMoney(totalExpenses);
        document.getElementById("netProfit").innerText = formatMoney(netProfit);
        document.getElementById("profitMargin").innerText = formatPercent(profitMarginPercent);
        
        // եթե net profit-ը բացասական է, ավելացնում ենք տեսողական նշում
        const netProfitSpan = document.getElementById("netProfit");
        const profitBlock = document.querySelector(".profit-line");
        if (netProfit < 0) {
            netProfitSpan.style.color = "#dc2626";
            profitBlock.style.background = "#ffe8e8";
        } else {
            netProfitSpan.style.color = "#15803d";
            profitBlock.style.background = "#e6f7ec";
        }
        
        // լրացուցիչ ստուգում, եթե արժեքները NaN, ապա 0
        if (isNaN(turnoverTax) || isNaN(grossSalaryFund) || isNaN(totalExpenses)) {
            resetToZeroDisplay();
        }
    }
    
    function resetToZeroDisplay() {
        const zeroMoney = "0 դրամ";
        document.getElementById("taxResult").innerText = zeroMoney;
        document.getElementById("salaryFund").innerText = zeroMoney;
        document.getElementById("incomeTax").innerText = zeroMoney;
        document.getElementById("netSalaryFund").innerText = zeroMoney;
        document.getElementById("expenseResult").innerText = zeroMoney;
        document.getElementById("totalResult").innerText = zeroMoney;
        document.getElementById("netProfit").innerText = zeroMoney;
        document.getElementById("profitMargin").innerText = "0%";
    }
    
    // optional: Enter ստեղնով հաշվարկ
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                calculateFullTax();
            }
        });
    });
    
    // միացնել հաշվարկը select-ի փոփոխության դեպքում (կամընտիր)
    document.getElementById("sector").addEventListener("change", function() {
        calculateFullTax();
    });
    
    // լռելյայն հաշվարկել դատարկ դեպքում (0 արժեքներով)
    window.addEventListener('DOMContentLoaded', function() {
        calculateFullTax();
    });
