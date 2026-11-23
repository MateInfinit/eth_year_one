using System.Collections.Generic;
using UnityEngine;

namespace EthGame.Combat
{
    public sealed class ProjectilePool : MonoBehaviour
    {
        [SerializeField] private BossProjectile projectilePrefab;
        [SerializeField, Min(1)] private int initialCapacity = 32;

        private readonly Queue<BossProjectile> available = new Queue<BossProjectile>();
        private readonly HashSet<BossProjectile> allProjectiles = new HashSet<BossProjectile>();

        private void Awake()
        {
            if (projectilePrefab == null)
            {
                Debug.LogError("ProjectilePool requires a BossProjectile prefab.", this);
                enabled = false;
                return;
            }

            int capacity = Mathf.Max(1, initialCapacity);
            for (int i = 0; i < capacity; i++)
            {
                BossProjectile projectile = CreatePooledProjectile();
                if (projectile == null)
                {
                    enabled = false;
                    return;
                }

                available.Enqueue(projectile);
            }
        }

        public bool TrySpawn(Vector2 position, Vector2 direction)
        {
            if (!enabled || available.Count == 0)
            {
                return false;
            }

            BossProjectile projectile = available.Dequeue();
            projectile.Activate(position, direction, this);
            return true;
        }

        private BossProjectile CreatePooledProjectile()
        {
            BossProjectile projectile = Instantiate(projectilePrefab, transform);
            if (projectile == null)
            {
                Debug.LogError("Failed to create a pooled boss projectile.", this);
                return null;
            }

            projectile.Deactivate();
            allProjectiles.Add(projectile);
            return projectile;
        }

        public void Return(BossProjectile projectile)
        {
            if (projectile == null || !allProjectiles.Contains(projectile) || available.Contains(projectile))
            {
                return;
            }

            projectile.Deactivate();
            available.Enqueue(projectile);
        }
    }
}