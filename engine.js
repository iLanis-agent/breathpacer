// BreathPacer engine - breathing pattern timing (no DOM)
(function (root) {
  'use strict';

  // Phases: in = inhale, hold, out = exhale, hold2 (after exhale). Seconds each.
  var PATTERNS = [
    { id: 'box',      label: 'Box 4-4-4-4',        phases: [['in', 4], ['hold', 4], ['out', 4], ['hold2', 4]], hint: 'steady focus' },
    { id: 'relax478', label: '4-7-8 relax',        phases: [['in', 4], ['hold', 7], ['out', 8]], hint: 'wind down' },
    { id: 'coherent', label: 'Coherent 5-5',       phases: [['in', 5], ['out', 5]], hint: 'HRV balance' },
    { id: 'sigh',     label: 'Double inhale sigh', phases: [['in', 2], ['in2', 1], ['out', 6]], hint: 'fast calm' }
  ];

  var PHASE_LABELS = { in: 'Breathe in', in2: 'Top up', hold: 'Hold', out: 'Breathe out', hold2: 'Hold' };

  function patternById(id) {
    for (var i = 0; i < PATTERNS.length; i++) if (PATTERNS[i].id === id) return PATTERNS[i];
    return null;
  }

  function cycleSeconds(pattern) {
    var s = 0;
    pattern.phases.forEach(function (p) { s += p[1]; });
    return s;
  }

  // Where are we at elapsedSeconds into a session? Returns phase info + overall progress.
  function phaseAt(pattern, elapsedSeconds, targetCycles) {
    var cyc = cycleSeconds(pattern);
    var total = cyc * targetCycles;
    var e = Math.max(0, Math.min(elapsedSeconds, total));
    var done = e >= total;
    var inCycle = e % cyc;
    var cycleNum = Math.min(targetCycles, Math.floor(e / cyc) + 1);
    var acc = 0;
    for (var i = 0; i < pattern.phases.length; i++) {
      var name = pattern.phases[i][0], dur = pattern.phases[i][1];
      if (inCycle < acc + dur) {
        var phaseElapsed = inCycle - acc;
        return {
          phase: done ? 'done' : name,
          phaseLabel: done ? 'Done' : PHASE_LABELS[name],
          phaseElapsed: Math.floor(phaseElapsed),
          phaseLeft: Math.ceil(dur - phaseElapsed),
          phaseDuration: dur,
          cycle: cycleNum,
          totalCycles: targetCycles,
          pct: Math.round(e / total * 100),
          done: done
        };
      }
      acc += dur;
    }
    return { phase: 'done', phaseLabel: 'Done', phaseElapsed: 0, phaseLeft: 0, phaseDuration: 0, cycle: targetCycles, totalCycles: targetCycles, pct: 100, done: true };
  }

  // Suggest cycles for a target session length in minutes.
  function cyclesFor(pattern, minutes) {
    var cyc = cycleSeconds(pattern);
    return Math.max(1, Math.round(minutes * 60 / cyc));
  }

  // Session log: [{id, patternId, seconds, at ISO}]
  function stats(log) {
    var total = 0, sessions = log.length;
    log.forEach(function (x) { total += Number(x.seconds) || 0; });
    return { sessions: sessions, totalSeconds: total, totalMinutes: Math.round(total / 6) / 10 };
  }

  function dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function streak(log, today) {
    var days = {};
    log.forEach(function (x) { days[dayKey(new Date(x.at))] = true; });
    var s = 0;
    for (var d = 0; d < 400; d++) {
      var day = new Date(today.getTime());
      day.setDate(day.getDate() - d);
      if (days[dayKey(day)]) s++;
      else if (d === 0) continue;
      else break;
    }
    return s;
  }

  var api = { PATTERNS: PATTERNS, PHASE_LABELS: PHASE_LABELS, patternById: patternById,
    cycleSeconds: cycleSeconds, phaseAt: phaseAt, cyclesFor: cyclesFor,
    stats: stats, dayKey: dayKey, streak: streak };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BreathEngine = api;
})(typeof self !== 'undefined' ? self : this);
