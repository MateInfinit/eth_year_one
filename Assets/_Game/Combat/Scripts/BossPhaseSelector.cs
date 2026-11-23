using System.Collections.Generic;

namespace EthGame.Combat
{
    /// <summary>Chooses the eligible phase with the highest HP threshold.</summary>
    public sealed class BossPhaseSelector
    {
        public int SelectPhase(IReadOnlyList<BossPhase> phases, float hpFraction)
        {
            if (phases == null || phases.Count == 0)
            {
                return -1;
            }

            int selectedIndex = -1;
            float selectedThreshold = float.NegativeInfinity;

            for (int i = 0; i < phases.Count; i++)
            {
                BossPhase phase = phases[i];
                if (phase == null || phase.HpThreshold > hpFraction || phase.HpThreshold <= selectedThreshold)
                {
                    continue;
                }

                selectedIndex = i;
                selectedThreshold = phase.HpThreshold;
            }

            return selectedIndex;
        }
    }
}