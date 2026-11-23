using System.Collections.Generic;
using UnityEngine;

namespace EthGame.Combat
{
    [CreateAssetMenu(menuName = "EthGame/Combat/Boss Phase Set", fileName = "BossPhaseSet_")]
    public sealed class BossPhaseSet : ScriptableObject
    {
        [SerializeField] private List<BossPhase> phases = new List<BossPhase>();

        public IReadOnlyList<BossPhase> Phases => phases;
    }
}