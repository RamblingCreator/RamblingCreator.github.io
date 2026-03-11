

window.addEventListener('load', function () {
  calculateStats()
})


function calculateStats() {
    let stats = document.getElementById("stats");
    // console.log(stats);
    for (const stat of stats.children) {
        current = stat.querySelector('input.currentStat');
        base = stat.querySelector('input.baseStat');
        temp = stat.querySelector('input.tempBonuses');
        permanent = stat.querySelector('input.permBonuses');
        edge = stat.querySelector('input.edge');
        current.value = (parseInt(base.value) + parseInt(temp.value) + parseInt(permanent.value));
        edge.value = Math.floor(parseInt(current.value)/10);

    }
}