using System.Collections;
using UnityEngine;

namespace EthGame.Combat
{
    public abstract class BossAttack : ScriptableObject
    {
        public abstract IEnumerator Execute(BossContext ctx);
    }
}