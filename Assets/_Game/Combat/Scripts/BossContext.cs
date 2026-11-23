using UnityEngine;

namespace EthGame.Combat
{
    public sealed class BossContext
    {
        public Transform BossTransform { get; }
        public ProjectilePool ProjectilePool { get; }

        public BossContext(Transform bossTransform, ProjectilePool projectilePool)
        {
            BossTransform = bossTransform;
            ProjectilePool = projectilePool;
        }
    }
}