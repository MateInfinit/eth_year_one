using System.Collections;
using UnityEngine;

namespace EthGame.Combat
{
    [CreateAssetMenu(menuName = "EthGame/Combat/Attacks/Radial Burst", fileName = "Attack_RadialBurst")]
    public sealed class RadialBurstAttack : BossAttack
    {
        [SerializeField, Min(1)] private int projectileCount = 8;
        [SerializeField, Min(0f)] private float startAngleDegrees;
        [SerializeField, Min(0f)] private float delayBetweenShots;

        public override IEnumerator Execute(BossContext ctx)
        {
            if (ctx == null || ctx.BossTransform == null || ctx.ProjectilePool == null)
            {
                yield break;
            }

            int count = Mathf.Max(1, projectileCount);
            float angleStep = 360f / count;
            Vector2 origin = ctx.BossTransform.position;

            for (int i = 0; i < count; i++)
            {
                float angle = (startAngleDegrees + angleStep * i) * Mathf.Deg2Rad;
                Vector2 direction = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle));
                ctx.ProjectilePool.TrySpawn(origin, direction);

                if (delayBetweenShots > 0f && i < count - 1)
                {
                    yield return new WaitForSeconds(delayBetweenShots);
                }
            }
        }
    }
}