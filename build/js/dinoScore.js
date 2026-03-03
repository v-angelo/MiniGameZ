const dinoScoreboard = document.querySelector("#dinoScoreboard");
const dinoScoreTBody = document.querySelector("#dinoScoreTable tbody");

let dinoRecords = JSON.parse(localStorage.getItem("dinoScore"));
if (!dinoRecords) {
    dinoRecords = [];
    dinoScoreboard.classList.remove("inline-block");
    dinoScoreboard.classList.add("hidden");
} else {
    dinoScoreboard.classList.remove("hidden");
    dinoScoreboard.classList.add("inline-block");
}

dinoScoreTBody.innerHTML = "";

dinoRecords.forEach((record, index) => {
    dinoScoreTBody.innerHTML += `
        <tr>
            <td class="p-2 text-lg font-semibold border-t border-slate-900/30 dark:border-gray-100/30">${index + 1}</td>
            <td class="p-2 text-lg font-semibold border-t border-slate-900/30 dark:border-gray-100/30">${record.name}</td>
            <td class="p-2 text-lg font-semibold border-t border-slate-900/30 dark:border-gray-100/30"><span class="text-purple-600">${record.score}</span> points</td>
        </tr>
    `;
});