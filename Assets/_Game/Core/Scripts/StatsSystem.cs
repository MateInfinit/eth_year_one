using System;
using System.Collections.Generic;

namespace EthGame.Core
{
    /// <summary>Pure player-stat state and progression logic, independent of Unity.</summary>
    public sealed class StatsSystem
    {
        private readonly int[] _levelThresholds;
        private readonly int[] _values;

        public StatsSystem(IEnumerable<int> levelThresholds)
        {
            if (levelThresholds == null)
            {
                throw new ArgumentNullException(nameof(levelThresholds));
            }

            var thresholds = new List<int>(levelThresholds);
            for (int i = 0; i < thresholds.Count; i++)
            {
                if (thresholds[i] <= 0 || (i > 0 && thresholds[i] <= thresholds[i - 1]))
                {
                    throw new ArgumentException(
                        "XP thresholds must be positive and strictly increasing.",
                        nameof(levelThresholds));
                }
            }

            _levelThresholds = thresholds.ToArray();
            _values = new int[Enum.GetValues(typeof(Stat)).Length];
            _values[(int)Stat.Level] = 1;
        }

        public int GetValue(Stat stat)
        {
            ValidateStat(stat);
            return _values[(int)stat];
        }

        /// <summary>Applies a relative stat change and returns the resulting values.</summary>
        public ChangeResult ApplyChange(Stat stat, int delta)
        {
            ValidateStat(stat);

            int index = (int)stat;
            int oldValue = _values[index];
            int minimum = stat == Stat.Level ? 1 : 0;
            long changed = (long)oldValue + delta;
            _values[index] = (int)Math.Max(minimum, Math.Min(int.MaxValue, changed));

            var levelsGained = new List<int>();
            if (stat == Stat.XP)
            {
                int level = _values[(int)Stat.Level];
                while (level <= _levelThresholds.Length &&
                       _values[(int)Stat.XP] >= _levelThresholds[level - 1])
                {
                    level++;
                    _values[(int)Stat.Level] = level;
                    levelsGained.Add(level);
                }
            }

            return new ChangeResult(stat, _values[index], _values[index] != oldValue, levelsGained);
        }

        private static void ValidateStat(Stat stat)
        {
            if ((uint)stat >= (uint)Enum.GetValues(typeof(Stat)).Length)
            {
                throw new ArgumentOutOfRangeException(nameof(stat), stat, "Unknown stat.");
            }
        }

        public sealed class ChangeResult
        {
            internal ChangeResult(Stat stat, int newValue, bool changed, IReadOnlyList<int> levelsGained)
            {
                Stat = stat;
                NewValue = newValue;
                Changed = changed;
                LevelsGained = levelsGained;
            }

            public Stat Stat { get; }
            public int NewValue { get; }
            public bool Changed { get; }
            public IReadOnlyList<int> LevelsGained { get; }
        }
    }
}