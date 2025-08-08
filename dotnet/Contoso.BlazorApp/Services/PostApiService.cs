using System.Net.Http.Json;
using Contoso.BlazorApp.Models;

namespace Contoso.BlazorApp.Services
{
    public class PostApiService
    {
        private readonly HttpClient _http;
        public PostApiService(HttpClient http)
        {
            _http = http;
            _http.BaseAddress = new Uri("http://localhost:8080/");
        }

        public async Task<List<Post>> GetPostsAsync()
        {
            return await _http.GetFromJsonAsync<List<Post>>("posts") ?? new List<Post>();
        }
        // ...추가 API 메서드 필요시 구현...
    }
}
