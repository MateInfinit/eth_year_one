using System;
using System.Collections.Generic;
using UnityEngine;

namespace EthGame.Combat
{
    [Serializable]
    public sealed class BossPhase
    {
        [SerializeField, Range(0f, 1f)] private float hpThreshold = 1f;
        [SerializeField] private List<BossAttack> attacks = new List<BossAttack>();

        public float HpThreshold => hpThreshold;
        public IReadOnlyList<BossAttack> Attacks => attacks;

        public BossPhase()
        {
        }

        public BossPhase(float hpThreshold, List<BossAttack> attacks)
        {
            this.hpThreshold = hpThreshold;
            this.attacks = attacks ?? new List<BossAttack>();
        }
    }
}