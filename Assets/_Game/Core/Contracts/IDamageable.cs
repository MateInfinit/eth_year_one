namespace EthGame.Core
{
    /// <summary>Anything that can take damage in combat (player, bosses, destructible props).</summary>
    public interface IDamageable
    {
        bool IsAlive { get; }
        void TakeDamage(int amount);
    }
}
