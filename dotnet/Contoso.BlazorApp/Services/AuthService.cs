using Blazored.LocalStorage;
using System.Threading.Tasks;

namespace Contoso.BlazorApp.Services
{
    public class AuthService
    {
        private readonly ILocalStorageService _localStorage;
        private const string UserKey = "user";

        public AuthService(ILocalStorageService localStorage)
        {
            _localStorage = localStorage;
        }

        public async Task<UserInfo?> GetUserAsync()
        {
            return await _localStorage.GetItemAsync<UserInfo>(UserKey);
        }

        public async Task LoginAsync(string username)
        {
            var user = new UserInfo { Username = username };
            await _localStorage.SetItemAsync(UserKey, user);
        }

        public async Task LogoutAsync()
        {
            await _localStorage.RemoveItemAsync(UserKey);
        }

        public class UserInfo
        {
            public string Username { get; set; } = string.Empty;
        }
    }
}
