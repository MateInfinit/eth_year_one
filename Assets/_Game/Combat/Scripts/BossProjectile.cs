using UnityEngine;

namespace EthGame.Combat
{
    public sealed class BossProjectile : MonoBehaviour
    {
        [SerializeField] private float speed = 5f;
        [SerializeField] private int damage = 1;
        [SerializeField, Min(0.1f)] private float lifetime = 8f;

        private Vector2 direction;
        private bool isActive;
        private ProjectilePool owningPool;
        private float remainingLifetime;

        public void Activate(Vector2 position, Vector2 travelDirection, ProjectilePool pool)
        {
            transform.position = position;
            direction = travelDirection.sqrMagnitude > 0f ? travelDirection.normalized : Vector2.right;
            owningPool = pool;
            remainingLifetime = Mathf.Max(0.1f, lifetime);
            isActive = true;
            gameObject.SetActive(true);
        }

        public void Deactivate()
        {
            isActive = false;
            gameObject.SetActive(false);
        }

        private void Update()
        {
            if (isActive)
            {
                transform.position += (Vector3)(direction * (speed * Time.deltaTime));
                remainingLifetime -= Time.deltaTime;
                if (remainingLifetime <= 0f)
                {
                    owningPool.Return(this);
                }
            }
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (!isActive || other.GetComponentInParent<BossController>() != null)
            {
                return;
            }

            EthGame.Core.IDamageable damageable = other.GetComponent<EthGame.Core.IDamageable>();
            if (damageable == null)
            {
                return;
            }

            damageable.TakeDamage(damage);
            if (owningPool != null)
            {
                owningPool.Return(this);
            }
            else
            {
                Deactivate();
            }
        }
    }
}