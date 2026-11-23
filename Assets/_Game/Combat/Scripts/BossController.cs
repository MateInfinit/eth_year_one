using System.Collections;
using EthGame.Core;
using UnityEngine;

namespace EthGame.Combat
{
    public sealed class BossController : MonoBehaviour, IDamageable
    {
        [SerializeField] private BossDefinition definition;
        [SerializeField] private BossPhaseSet phaseSet;
        [SerializeField] private ProjectilePool projectilePool;
        [SerializeField, Min(1)] private int maxHp = 100;
        [SerializeField, Min(0f)] private float attackInterval = 1f;

        private readonly BossPhaseSelector phaseSelector = new BossPhaseSelector();
        private int currentHp;
        private bool fightEnded;

        public int CurrentHp => currentHp;
        public int MaxHp => maxHp;
        public bool IsAlive => !fightEnded && currentHp > 0;

        private void OnEnable()
        {
            maxHp = Mathf.Max(1, maxHp);
            currentHp = maxHp;
            fightEnded = false;

            if (phaseSet == null)
            {
                Debug.LogError("BossController requires a BossPhaseSet.", this);
                return;
            }

            if (definition == null)
            {
                Debug.LogError("BossController requires a BossDefinition.", this);
                return;
            }

            StartCoroutine(RunAttackLoop());
        }

        public void TakeDamage(int amount)
        {
            if (!IsAlive || amount <= 0)
            {
                return;
            }

            currentHp = Mathf.Max(0, currentHp - amount);
            if (currentHp == 0)
            {
                fightEnded = true;
                StopAllCoroutines();
                GameEvents.RaiseBossFightEnded(definition, true);
            }
        }

        private IEnumerator RunAttackLoop()
        {
            while (IsAlive)
            {
                int phaseIndex = GetCurrentPhaseIndex();
                if (phaseIndex >= 0)
                {
                    BossPhase phase = phaseSet.Phases[phaseIndex];
                    BossAttack attack = ChooseAttack(phase);
                    if (attack != null)
                    {
                        yield return attack.Execute(new BossContext(transform, projectilePool));
                    }
                }

                if (attackInterval > 0f)
                {
                    yield return new WaitForSeconds(attackInterval);
                }
                else
                {
                    yield return null;
                }
            }
        }

        private int GetCurrentPhaseIndex()
        {
            float hpFraction = maxHp > 0 ? (float)currentHp / maxHp : 0f;
            return phaseSelector.SelectPhase(phaseSet.Phases, hpFraction);
        }

        private static BossAttack ChooseAttack(BossPhase phase)
        {
            if (phase == null || phase.Attacks == null || phase.Attacks.Count == 0)
            {
                return null;
            }

            int index = Random.Range(0, phase.Attacks.Count);
            return phase.Attacks[index];
        }
    }
}